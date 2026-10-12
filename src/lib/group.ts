import { sortKey, type PartialDate } from './dates';

export interface Group<T> {
  key: string;
  items: T[];
}

export function groupBy<T>(items: T[], keyOf: (item: T) => string): Group<T>[] {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const key = keyOf(item);
    const bucket = groups.get(key);
    if (bucket) bucket.push(item);
    else groups.set(key, [item]);
  }
  return [...groups].map(([key, grouped]) => ({ key, items: grouped }));
}

export function newestFirst<T>(items: T[], dateOf: (item: T) => PartialDate): T[] {
  return [...items].sort((a, b) => sortKey(dateOf(b)).localeCompare(sortKey(dateOf(a))));
}
