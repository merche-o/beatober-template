# Beatober — Mechant Chaton

Reusable [Remotion](https://www.remotion.dev) builder for **31 Instagram Reels** for [Beatober 2026](https://www.beatober.com/). Each day gets a prompt-driven procedural 3D visualizer, `DAY NN` + prompt type, and optional beat-synced accents.

Artist: **Mechant Chaton**  
Format: **1080×1920**, **30fps**, **45 seconds**  
Palette: black + jade, with purple / gold accents

## Quick start

```bash
npm install
npm run studio
```

Open [http://127.0.0.1:4466](http://127.0.0.1:4466). Pick `BeatoberReel` and set the `day` prop (1–31), or open a `Day01`…`Day31` composition.

Without audio, each day still previews with an idle pulse so you can check art direction.

## Daily workflow — link audio → preview → render

### 1. Drop your beat

Save the file as:

```text
public/audio/day-01.mp3
public/audio/day-02.mp3
…
public/audio/day-31.mp3
```

The composition links audio from the `day` prop automatically.

### 2. Analyze beats + auto-highlight window

```bash
npm run prepare:day -- 1
```

Writes `public/beatmaps/day-01.json` with:

- beat grid (`bpm`, `beatsSec`)
- `highlightStartSec` — strongest ~45s window (for auto highlight)

### 3. Preview in Studio

Set props on `BeatoberReel`:

| Prop | Meaning |
| --- | --- |
| `day` | `1`–`31` (loads prompt + art direction) |
| `autoHighlight` | `true` → start at `highlightStartSec` from the beatmap |
| `startOffsetSec` | Manual start time in seconds — **wins over** `autoHighlight` |
| `renderer` | `auto` (default) · `three` · `canvas` — Three.js when WebGL works, else Canvas 2D |
| `audioFile` / `beatmapFile` | Optional path overrides |

**Audio window priority** for the 45s clip:

1. `startOffsetSec` if set (manual)
2. else `autoHighlight: true` → beatmap `highlightStartSec` (best-energy window from `prepare:day`)
3. else `0` (from the start of the file)

You can leave `autoHighlight` off and still set `startOffsetSec`, or run prepare once and flip `autoHighlight` on in Studio without re-exporting audio.

### 4. Render

```bash
npm run render:day -- 1
npm run render:day -- 1 --auto-highlight
npm run render:day -- 1 --offset 12.5
```

Output: `out/day-01.mp4`

## Project layout

```text
src/
  BeatoberReel.tsx          # main composition
  data/prompts.ts           # 31 Beatober prompts + artDirection
  audio/                    # beatmap types + BeatEngine hook
  scenes/motifs/            # procedural 3D motif families
  components/DayTitle.tsx
scripts/
  analyze-beatmap.mjs       # prepare:day
  render-day.mjs            # render:day
public/audio/day-NN.mp3     # you drop these in (not committed)
public/beatmaps/day-NN.json # from prepare:day (not committed)
```

## Motifs

Each prompt maps to a motif family (seeded by day): `neonCorridor`, `weatherField`, `orbHorizon`, `clubLattice`, `voidRings`, `tunnelRibbon`. Bass + beat accents drive scale, emissive glow, and title micro-pulses.

## Notes

- Real music files are **not** shipped in git — only the path convention and tools.
- Export ~45s beats, or use `autoHighlight` / `startOffsetSec` on longer files.
- Visualizer: `renderer: "auto"` uses **Three.js** when WebGL is available, otherwise a matching **Canvas 2D** procedural motif (same prompts / beat accents). Force with `"three"` or `"canvas"`.
- Three.js renders use Chromium `angle` GL (`--gl=angle` on render / already in `render:day`).
