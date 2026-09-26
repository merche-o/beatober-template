#!/usr/bin/env node
/**
 * Analyze a day's audio into public/beatmaps/day-NN.json
 * Usage: node scripts/analyze-beatmap.mjs --day 1
 *        node scripts/analyze-beatmap.mjs --file public/audio/day-01.mp3 --day 1
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import decode from "audio-decode";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const WINDOW_SEC = 45;

const pad = (n) => String(n).padStart(2, "0");

const parseArgs = (argv) => {
  const out = { day: null, file: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--day") out.day = Number(argv[++i]);
    else if (a === "--file") out.file = argv[++i];
    else if (/^\d+$/.test(a) && out.day == null) out.day = Number(a);
  }
  return out;
};

const mixMono = (audioBuffer) => {
  const { numberOfChannels, length, sampleRate } = audioBuffer;
  const mono = new Float32Array(length);
  for (let c = 0; c < numberOfChannels; c++) {
    const ch = audioBuffer.getChannelData(c);
    for (let i = 0; i < length; i++) mono[i] += ch[i] / numberOfChannels;
  }
  return { mono, sampleRate, durationSec: length / sampleRate };
};

/** Simple one-pole lowpass for bass emphasis */
const lowpass = (input, sampleRate, cutoff = 150) => {
  const out = new Float32Array(input.length);
  const rc = 1 / (2 * Math.PI * cutoff);
  const dt = 1 / sampleRate;
  const alpha = dt / (rc + dt);
  let prev = 0;
  for (let i = 0; i < input.length; i++) {
    prev = prev + alpha * (input[i] - prev);
    out[i] = prev;
  }
  return out;
};

const rmsEnvelope = (mono, sampleRate, hopSec = 0.05) => {
  const hop = Math.max(1, Math.floor(sampleRate * hopSec));
  const values = [];
  for (let i = 0; i < mono.length; i += hop) {
    let sum = 0;
    const end = Math.min(mono.length, i + hop);
    for (let j = i; j < end; j++) sum += mono[j] * mono[j];
    values.push(Math.sqrt(sum / Math.max(1, end - i)));
  }
  return { values, hopSec };
};

const findHighlightStart = (env, hopSec, windowSec, durationSec) => {
  const win = Math.max(1, Math.round(windowSec / hopSec));
  if (env.length <= win) return 0;
  let bestSum = -1;
  let bestIdx = 0;
  let sum = 0;
  for (let i = 0; i < env.length; i++) {
    sum += env[i];
    if (i >= win) sum -= env[i - win];
    if (i >= win - 1 && sum > bestSum) {
      bestSum = sum;
      bestIdx = i - win + 1;
    }
  }
  const start = bestIdx * hopSec;
  const maxStart = Math.max(0, durationSec - windowSec);
  return Math.min(start, maxStart);
};

const estimateBpmAndBeats = (bass, sampleRate, durationSec) => {
  // Onset strength via half-wave rectified spectral flux proxy on bass signal
  const hop = Math.floor(sampleRate * 0.01);
  const frameSize = hop * 4;
  const flux = [];
  let prevEnergy = 0;
  for (let i = 0; i + frameSize < bass.length; i += hop) {
    let energy = 0;
    for (let j = 0; j < frameSize; j++) {
      const v = bass[i + j];
      energy += v * v;
    }
    energy = Math.sqrt(energy / frameSize);
    flux.push(Math.max(0, energy - prevEnergy));
    prevEnergy = energy;
  }

  // Autocorrelation for tempo (90–140 BPM house/nu-disco range)
  const minBpm = 90;
  const maxBpm = 140;
  const minLag = Math.round(60 / maxBpm / 0.01);
  const maxLag = Math.round(60 / minBpm / 0.01);
  let bestLag = minLag;
  let bestScore = -1;
  for (let lag = minLag; lag <= maxLag; lag++) {
    let score = 0;
    for (let i = 0; i + lag < flux.length; i++) {
      score += flux[i] * flux[i + lag];
    }
    if (score > bestScore) {
      bestScore = score;
      bestLag = lag;
    }
  }
  const bpm = Math.round(60 / (bestLag * 0.01));
  const interval = 60 / bpm;

  // Peak pick flux for beat candidates, then quantize to grid
  const threshold =
    flux.reduce((a, b) => a + b, 0) / Math.max(1, flux.length) * 1.6;
  const peaks = [];
  for (let i = 1; i < flux.length - 1; i++) {
    if (flux[i] > threshold && flux[i] >= flux[i - 1] && flux[i] >= flux[i + 1]) {
      peaks.push(i * 0.01);
    }
  }

  let offsetSec = peaks[0] ?? 0;
  // Refine offset: choose peak that aligns most peaks to the grid
  let bestOffset = offsetSec;
  let bestHits = -1;
  for (const candidate of peaks.slice(0, 24)) {
    let hits = 0;
    for (const p of peaks) {
      const phase = ((p - candidate) / interval) % 1;
      const dist = Math.min(Math.abs(phase), 1 - Math.abs(phase));
      if (dist < 0.12) hits++;
    }
    if (hits > bestHits) {
      bestHits = hits;
      bestOffset = candidate;
    }
  }
  offsetSec = bestOffset;

  const beatsSec = [];
  for (let t = offsetSec; t < durationSec; t += interval) {
    if (t >= 0) beatsSec.push(Number(t.toFixed(4)));
  }

  return { bpm, offsetSec: Number(offsetSec.toFixed(4)), beatsSec };
};

const main = async () => {
  const args = parseArgs(process.argv.slice(2));
  if (!args.day || args.day < 1 || args.day > 31) {
    console.error("Usage: node scripts/analyze-beatmap.mjs --day <1-31>");
    process.exit(1);
  }

  const audioPath =
    args.file ??
    path.join(root, "public", "audio", `day-${pad(args.day)}.mp3`);

  if (!fs.existsSync(audioPath)) {
    console.error(`Audio not found: ${audioPath}`);
    console.error("Drop your beat at that path first, then re-run.");
    process.exit(1);
  }

  const buf = fs.readFileSync(audioPath);
  const audioBuffer = await decode(buf);
  const { mono, sampleRate, durationSec } = mixMono(audioBuffer);
  const bass = lowpass(mono, sampleRate, 160);
  const { values, hopSec } = rmsEnvelope(bass, sampleRate, 0.05);
  const highlightStartSec = Number(
    findHighlightStart(values, hopSec, WINDOW_SEC, durationSec).toFixed(3),
  );
  const { bpm, offsetSec, beatsSec } = estimateBpmAndBeats(
    bass,
    sampleRate,
    durationSec,
  );

  const beatmap = {
    day: args.day,
    durationSec: Number(durationSec.toFixed(3)),
    bpm,
    offsetSec,
    beatsSec,
    highlightStartSec,
    windowSec: WINDOW_SEC,
  };

  const outDir = path.join(root, "public", "beatmaps");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `day-${pad(args.day)}.json`);
  fs.writeFileSync(outPath, JSON.stringify(beatmap, null, 2));

  console.log(`Wrote ${outPath}`);
  console.log(
    `duration=${beatmap.durationSec}s bpm=${bpm} offset=${offsetSec}s highlight=${highlightStartSec}s beats=${beatsSec.length}`,
  );
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
