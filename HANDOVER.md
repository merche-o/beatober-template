# Handover — Beatober Remotion Builder (Mechant Chaton)

Use this doc to continue in **local Cursor** after cloning from GitHub.

**Repo:** https://github.com/merche-o/beatober-template  
**Artist:** Mechant Chaton  
**Challenge:** [Beatober 2026](https://www.beatober.com/) — 31 daily beats → Instagram Reels

---

## 1. Get running locally

```bash
git clone https://github.com/merche-o/beatober-template.git
cd beatober-template
npm install
npm run studio
```

Studio: http://127.0.0.1:4466

Open compositions:

- `BeatoberReel` — set `day` (1–31) in props
- or `Day01` … `Day31` for quick browsing

Without audio, each day still previews with an idle pulse (art direction check).

---

## 2. Daily workflow (music → preview → MP4)

### Link audio (naming = linking)

Drop the beat here:

```text
public/audio/day-01.mp3
…
public/audio/day-31.mp3
```

Composition prop `day: N` loads `public/audio/day-NN.mp3` automatically.

Real MP3s are **gitignored** — keep them local (or use LFS / private storage if you want).

### Analyze beats + auto-highlight window

```bash
npm run prepare:day -- 1
```

Writes `public/beatmaps/day-01.json` with:

- `bpm`, `beatsSec[]` — discrete beat accents
- `highlightStartSec` — strongest ~45s energy window

Beatmaps are also gitignored.

### Preview

In Studio, on `BeatoberReel`:

| Prop | Meaning |
| --- | --- |
| `day` | `1`–`31` |
| `autoHighlight` | `true` → start at beatmap `highlightStartSec` |
| `startOffsetSec` | Manual start (seconds) — **wins over** `autoHighlight` |
| `renderer` | `auto` \| `three` \| `canvas` |
| `audioFile` / `beatmapFile` | Optional path overrides |

**45s window priority**

1. `startOffsetSec` if set  
2. else `autoHighlight` → `highlightStartSec`  
3. else `0` (file start)

### Render

```bash
npm run render:day -- 1
npm run render:day -- 1 --auto-highlight
npm run render:day -- 1 --offset 12.5
```

Output: `out/day-01.mp4` (1080×1920, 30fps, 45s). Uses `--gl=angle` for Three.js.

---

## 3. What was built

### Product slice

- Remotion Instagram Reels template for all **31 Beatober prompts**
- On-screen copy: **`DAY NN` + prompt** only (+ quiet “Mechant Chaton” / “Beatober” marks)
- Palette: **black + jade**, purple/gold accents
- **Unique art direction per day** via prompt → motif family + seed
- **Beat-synced accents** (bass from `visualizeAudio` + optional beatmap pulses)
- **Auto-highlight** (optional) + **manual offset**
- Easy audio drop-in by filename

### Motif families (`src/data/prompts.ts` + `src/scenes/`)

| Motif | Example prompts |
| --- | --- |
| `neonCorridor` | City / night defaults |
| `weatherField` | Rainy Day, Storm Coming, Snow Day, … |
| `orbHorizon` | Sunrise, Golden Hour, First Light, … |
| `clubLattice` | House Party, After Hours, Last Dance, … |
| `voidRings` | Empty Streets, Waiting Room, Déjà Vu, … |
| `tunnelRibbon` | Night Drive, Last Train, Open Road, The End, … |

### Renderers

- **`three`** — `@remotion/three` + R3F procedural meshes  
- **`canvas`** — 2D procedural fallback (same motifs / branding)  
- **`auto`** — Three if WebGL works, else Canvas  

Cloud agents often lack WebGL; on a normal laptop `auto` should pick Three.

### Format

- `1080×1920`, `30fps`, **45 seconds** (`src/theme.ts`)

---

## 4. Important paths

```text
src/
  BeatoberReel.tsx          # main composition
  Root.tsx                  # BeatoberReel + Day01–Day31
  schema.ts                 # Zod props
  theme.ts                  # colors + reel constants
  data/prompts.ts           # 31 prompts + artDirection
  audio/beatmap.ts          # offset resolution, accents
  audio/useBeatState.ts     # bass + beat hook
  components/DayTitle.tsx
  scenes/
    ProceduralScene.tsx     # auto three/canvas switch
    ThreeScene.tsx
    CanvasProceduralScene.tsx
    motifs/*                # 6 motif families
scripts/
  analyze-beatmap.mjs       # npm run prepare:day
  render-day.mjs            # npm run render:day
public/
  audio/day-NN.mp3          # you add (ignored)
  audio/silence.wav         # hook fallback (committed)
  beatmaps/day-NN.json      # from prepare:day (ignored)
README.md                   # short user-facing guide
```

---

## 5. Suggested next work (local)

Priority ideas — not started unless noted:

1. **Tune motifs** while scrubbing Studio with real house / neo-soul / nu-disco stems  
2. **Tighten beat detection** on your genre (BPM range in `scripts/analyze-beatmap.mjs` is ~90–140)  
3. **Per-day accent overrides** in `prompts.ts` if auto motif mapping feels wrong  
4. **Batch render** script for all days that have audio  
5. **Safe area / IG overlays** check (captions, username) if you burn in more UI later  
6. Optional: commit sample beatmaps (no audio) for demo days  

---

## 6. Gotchas

- **Do not commit MP3s** unless you intend to (currently gitignored).  
- `prepare:day` needs the file at `public/audio/day-NN.mp3` first.  
- Longer than 45s tracks: use `autoHighlight` or `startOffsetSec`; the composition length stays 45s.  
- If Three.js fails in Studio, set `renderer: "canvas"` or fix GPU/WebGL; renders use `angle`.  
- Zod must stay on Remotion’s expected version (`4.5.4` pinned).  
- Older **Cursor Origin** remote (`origin.cursor.com`) is unrelated — GitHub is source of truth now.

---

## 7. Useful commands

```bash
npm run studio
npm run prepare:day -- <1-31>
npm run render:day -- <1-31> [--auto-highlight] [--offset SEC]
npm run lint
npx remotion still BeatoberReel out/preview.png --props='{"day":1,"renderer":"auto"}' --frame=90 --gl=angle
```

---

## 8. Cloud → local checklist

- [x] Code on GitHub `merche-o/beatober-template` `main`  
- [ ] Clone locally  
- [ ] `npm install` + `npm run studio`  
- [ ] Drop day-01 audio, `prepare:day`, preview, render one Reel  
- [ ] Iterate art / beat sync with your real tracks  

That’s the full handover for continuing in local Cursor.
