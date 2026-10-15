/** Accent colours for tiles and the timeline. Each maps to a `hue-<name>` CSS class that sets --c. */
export const ALL_HUES = ['accent', 'blue', 'green', 'purple'] as const;
export type Hue = (typeof ALL_HUES)[number];
