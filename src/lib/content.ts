import { getCollection, getEntry, type CollectionEntry, type CollectionKey } from 'astro:content';

// Astro only logs (does not fail) when a YAML file can't be parsed, leaving the
// collection empty. Every page loads content through these helpers so an
// empty or missing collection fails the build instead of shipping a blank page.

export async function requireCollection<C extends CollectionKey>(name: C): Promise<CollectionEntry<C>[]> {
  const items = (await getCollection(name)) as CollectionEntry<C>[];
  if (items.length === 0) {
    throw new Error(`Content collection "${name}" is empty or failed to load. Check src/content/${name}.yaml`);
  }
  return items;
}

export async function requireDocument<C extends CollectionKey>(name: C): Promise<CollectionEntry<C>> {
  const entry = (await getEntry(name, 'main')) as CollectionEntry<C> | undefined;
  if (!entry) throw new Error(`Content document "${name}" failed to load. Check src/content/${name}.yaml`);
  return entry;
}

export async function requirePage(id: 'home' | 'about' | 'contact'): Promise<CollectionEntry<'pages'>> {
  const entry = await getEntry('pages', id);
  if (!entry) throw new Error(`Page "${id}" is missing. Expected src/content/pages/${id}.md`);
  return entry;
}
