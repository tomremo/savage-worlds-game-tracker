'use client';

import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// Function to format inline markdown formatting (bold, italic, code)
export function parseInlineMarkdown(text: string): React.ReactNode[] {
  // Regex to split on bold (**text**), italic (*text*), code (`code`)
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let keyIdx = 0;

  while (remaining.length > 0) {
    // Match bold **text** or __text__
    const boldMatch = remaining.match(/^(\*\*|__)(.*?)\1/);
    if (boldMatch) {
      parts.push(
        <strong key={keyIdx++} className="font-extrabold text-black">
          {boldMatch[2]}
        </strong>
      );
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    // Match italic *text* or _text_
    const italicMatch = remaining.match(/^(\*|_)(.*?)\1/);
    if (italicMatch) {
      parts.push(
        <em key={keyIdx++} className="italic text-gray-900">
          {italicMatch[2]}
        </em>
      );
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }

    // Match inline code `code`
    const codeMatch = remaining.match(/^`(.*?)`/);
    if (codeMatch) {
      parts.push(
        <code
          key={keyIdx++}
          className="bg-black text-white px-1 font-mono text-[11px] border border-gray-800"
        >
          {codeMatch[1]}
        </code>
      );
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    // Find next special char
    const nextSpecial = remaining.search(/[\*_`]/);
    if (nextSpecial === -1) {
      parts.push(remaining);
      break;
    } else if (nextSpecial > 0) {
      parts.push(remaining.slice(0, nextSpecial));
      remaining = remaining.slice(nextSpecial);
    } else {
      // Single unmatched special character
      parts.push(remaining[0]);
      remaining = remaining.slice(1);
    }
  }

  return parts;
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  if (!content) return null;

  const lines = content.split(/\r?\n/);
  const elements: React.ReactNode[] = [];

  let inUnorderedList = false;
  let listItems: React.ReactNode[] = [];

  const flushList = () => {
    if (inUnorderedList && listItems.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-1 pl-2 my-2 font-sans">
          {listItems}
        </ul>
      );
      listItems = [];
      inUnorderedList = false;
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Horizontal rule
    if (trimmed === '---' || trimmed === '***') {
      flushList();
      elements.push(<hr key={index} className="border-t-2 border-black my-3" />);
      return;
    }

    // Headings
    if (trimmed.startsWith('# ')) {
      flushList();
      elements.push(
        <h1 key={index} className="font-serif font-black text-lg text-black uppercase tracking-wider border-b-2 border-black pb-1 mt-3 mb-2">
          {parseInlineMarkdown(trimmed.slice(2))}
        </h1>
      );
      return;
    }
    if (trimmed.startsWith('## ')) {
      flushList();
      elements.push(
        <h2 key={index} className="font-serif font-bold text-base text-black uppercase tracking-wider border-b border-black/50 pb-0.5 mt-2.5 mb-1.5">
          {parseInlineMarkdown(trimmed.slice(3))}
        </h2>
      );
      return;
    }
    if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(
        <h3 key={index} className="font-serif font-bold text-sm text-red-700 uppercase tracking-wide mt-2 mb-1">
          {parseInlineMarkdown(trimmed.slice(4))}
        </h3>
      );
      return;
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      flushList();
      elements.push(
        <blockquote key={index} className="border-l-4 border-black pl-3 py-1 bg-yellow-50/80 my-2 italic text-gray-800 text-xs">
          {parseInlineMarkdown(trimmed.slice(2))}
        </blockquote>
      );
      return;
    }

    // Unordered List (- item or * item)
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      inUnorderedList = true;
      listItems.push(
        <li key={index} className="text-xs text-gray-900 leading-relaxed">
          {parseInlineMarkdown(trimmed.slice(2))}
        </li>
      );
      return;
    }

    // Ordered List (1. item)
    const numListMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (numListMatch) {
      flushList();
      elements.push(
        <div key={index} className="flex gap-2 text-xs text-gray-900 font-sans my-0.5">
          <span className="font-mono font-bold">{numListMatch[1]}.</span>
          <span>{parseInlineMarkdown(numListMatch[2])}</span>
        </div>
      );
      return;
    }

    // Empty line / paragraph break
    if (trimmed === '') {
      flushList();
      elements.push(<div key={index} className="h-2" />);
      return;
    }

    // Normal paragraph text
    flushList();
    elements.push(
      <p key={index} className="text-xs text-gray-900 leading-relaxed font-sans my-1">
        {parseInlineMarkdown(trimmed)}
      </p>
    );
  });

  flushList();

  return <div className={`space-y-1 ${className}`}>{elements}</div>;
}
