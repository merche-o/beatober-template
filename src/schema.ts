import { z } from "zod";

export const beatoberSchema = z.object({
  day: z.number().int().min(1).max(31),
  /** Override default public/audio/day-NN.mp3 */
  audioFile: z.string().optional(),
  /** Override default public/beatmaps/day-NN.json */
  beatmapFile: z.string().optional(),
  /**
   * Manual start time in the audio file (seconds).
   * Wins over autoHighlight when set.
   */
  startOffsetSec: z.number().min(0).optional(),
  /**
   * When true (and startOffsetSec unset), use highlightStartSec from the beatmap.
   */
  autoHighlight: z.boolean(),
  /**
   * Visualizer backend. `auto` uses Three.js when WebGL works, else Canvas 2D.
   */
  renderer: z.enum(["auto", "three", "canvas"]),
});

export type BeatoberProps = z.infer<typeof beatoberSchema>;

export const defaultProps: BeatoberProps = {
  day: 1,
  autoHighlight: false,
  renderer: "auto",
};
