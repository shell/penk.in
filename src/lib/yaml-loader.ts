import { CORE_SCHEMA, load } from 'js-yaml';

// CORE_SCHEMA keeps `2026-03-15` as a string instead of turning it into a Date.

/** Parse YAML text. Blank or comment-only text yields null, since js-yaml rejects it outright. */
function loadYaml(text: string): unknown {
  const hasContent = text.split('\n').some((line) => {
    const trimmed = line.trim();
    return trimmed !== '' && !trimmed.startsWith('#');
  });
  return hasContent ? load(text, { schema: CORE_SCHEMA }) : null;
}

/** Parse a YAML file whose top level is a list. Entry ids are their 1-based positions. */
export function parseYamlList(text: string): Record<string, unknown>[] {
  const data = loadYaml(text);
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Expected a non-empty YAML list at the top level');
  }
  return data.map((item, index) => ({ id: String(index + 1), ...(item as object) }));
}

/** Parse a YAML file whose top level is a single mapping. It becomes one entry with id "main". */
export function parseYamlDocument(text: string): Record<string, unknown>[] {
  const data = loadYaml(text);
  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('Expected a YAML mapping at the top level');
  }
  return [{ id: 'main', ...(data as object) }];
}
