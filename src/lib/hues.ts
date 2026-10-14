/** Accent colours for tiles and the timeline. Each maps to a `hue-<name>` CSS class that sets --c. */
export const ALL_HUES = ['accent', 'blue', 'green', 'purple'] as const;
export type Hue = (typeof ALL_HUES)[number];

/** The decade cycle on the Life timeline. */
export const HUES: readonly Hue[] = ['accent', 'blue', 'green', 'purple'];
