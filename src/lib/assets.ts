// Look up files collected with import.meta.glob by their bare name (no folder, no extension).

const nameOf = (path: string) => path.slice(path.lastIndexOf('/') + 1).replace(/\.[^.]+$/, '');

export function pickAsset<T>(modules: Record<string, T>, name: string): T | undefined {
  for (const [path, mod] of Object.entries(modules)) {
    if (nameOf(path) === name) return mod;
  }
  return undefined;
}

export function assetNames(modules: Record<string, unknown>): string[] {
  return Object.keys(modules).map(nameOf).sort();
}
