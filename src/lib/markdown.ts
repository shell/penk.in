import { marked } from 'marked';

/** Render trusted inline Markdown (links, emphasis) to HTML, without a wrapping <p>. */
export function inline(markdown: string): string {
  return marked.parseInline(markdown, { async: false }) as string;
}
