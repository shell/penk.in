import { describe, expect, it } from 'vitest';
import { parseYamlDocument, parseYamlList } from '../../src/lib/yaml-loader';

describe('parseYamlList', () => {
  it('assigns 1-based string ids in file order', () => {
    expect(parseYamlList('- title: A\n- title: B\n')).toEqual([
      { id: '1', title: 'A' },
      { id: '2', title: 'B' },
    ]);
  });

  it('keeps dates as strings and years as numbers', () => {
    expect(parseYamlList('- a: 2026-03-15\n  b: 2026-03\n  c: 2015\n')).toEqual([
      { id: '1', a: '2026-03-15', b: '2026-03', c: 2015 },
    ]);
  });

  it('rejects a mapping', () => {
    expect(() => parseYamlList('title: A\n')).toThrow('non-empty YAML list');
  });

  it('rejects an empty file', () => {
    expect(() => parseYamlList('')).toThrow('non-empty YAML list');
  });
});

describe('parseYamlDocument', () => {
  it('wraps a mapping as the single entry "main"', () => {
    expect(parseYamlDocument('name: V\nstart: 2015\n')).toEqual([{ id: 'main', name: 'V', start: 2015 }]);
  });

  it('rejects a list', () => {
    expect(() => parseYamlDocument('- a: 1\n')).toThrow('YAML mapping');
  });
});
