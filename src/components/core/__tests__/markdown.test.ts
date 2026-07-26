import { describe, it, expect } from 'vitest';
import { parseInlineMarkdown } from '../MarkdownRenderer';

describe('Markdown Renderer Parser', () => {
  it('should parse bold text correctly', () => {
    const nodes = parseInlineMarkdown('This is **bold** text');
    expect(nodes).toHaveLength(3);
    expect(nodes[0]).toBe('This is ');
    expect(nodes[2]).toBe(' text');
  });

  it('should parse italic text correctly', () => {
    const nodes = parseInlineMarkdown('This is *italic* text');
    expect(nodes).toHaveLength(3);
    expect(nodes[0]).toBe('This is ');
    expect(nodes[2]).toBe(' text');
  });

  it('should parse inline code correctly', () => {
    const nodes = parseInlineMarkdown('Code: `const x = 10;`');
    expect(nodes).toHaveLength(2);
    expect(nodes[0]).toBe('Code: ');
  });
});
