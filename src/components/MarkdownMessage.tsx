'use client'
import type { ComponentProps, JSX } from 'react';
import ReactMarkdown, { type Components, type ExtraProps } from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Tag = keyof JSX.IntrinsicElements;

/** Drop react-markdown's `node` prop so it never reaches the DOM. */
function domProps<P extends ExtraProps>(props: P): Omit<P, 'node'> {
  const rest = { ...props };
  delete rest.node;
  return rest;
}

/** Build a markdown element renderer for `tag` with fixed Tailwind classes. */
function styled<T extends Tag>(tag: T, className: string) {
  const Tag = tag as unknown as React.ElementType;
  function Styled(props: ComponentProps<T> & ExtraProps) {
    return <Tag className={className} {...domProps(props)} />;
  }
  Styled.displayName = `Markdown.${tag}`;
  return Styled;
}

/** Dark-theme element styles for assistant replies (no @tailwindcss/typography needed). */
const components: Components = {
  p: styled('p', 'mb-2.5 leading-relaxed text-[#e3e3e3] last:mb-0'),
  strong: styled('strong', 'font-semibold text-white'),
  em: styled('em', 'italic'),
  ul: styled('ul', 'my-2 list-disc space-y-1.5 pl-5 marker:text-amber-400/70'),
  ol: styled('ol', 'my-2 list-decimal space-y-1.5 pl-5 marker:text-[#9aa0a6]'),
  li: styled('li', 'leading-relaxed text-[#e3e3e3]'),
  h1: styled('h1', 'mb-1.5 mt-3 text-lg font-semibold text-white first:mt-0'),
  h2: styled('h2', 'mb-1.5 mt-3 text-base font-semibold text-white first:mt-0'),
  h3: styled('h3', 'mb-1.5 mt-3 font-semibold text-white first:mt-0'),
  blockquote: styled('blockquote', 'my-2 border-l-2 border-amber-400/60 pl-3 italic text-[#cbd5e1]'),
  hr: styled('hr', 'my-4 border-white/10'),
  th: styled('th', 'border-b border-white/10 bg-[#1e1f20] px-3 py-2 text-left font-medium text-white'),
  td: styled('td', 'border-b border-white/6 px-3 py-2 text-[#d1d5db]'),
  // Fenced code blocks: block container; the inner <code> drops the inline-chip styling.
  pre: styled(
    'pre',
    'my-3 overflow-x-auto rounded-lg border border-white/8 bg-[#1e1f20] p-3 text-xs leading-relaxed [&>code]:bg-transparent [&>code]:p-0 [&>code]:text-[#e3e3e3]',
  ),
  code: styled('code', 'rounded bg-[#1e1f20] px-1.5 py-0.5 font-mono text-xs text-amber-300'),
  a: (props) => (
    <a
      className="text-amber-300 underline decoration-amber-300/40 underline-offset-2 hover:decoration-amber-300"
      target="_blank"
      rel="noopener noreferrer"
      {...domProps(props)}
    />
  ),
  // Wrapper lets wide tables scroll horizontally on small screens instead of overflowing.
  table: (props) => (
    <div className="my-3 overflow-x-auto rounded-lg border border-white/10">
      <table className="w-full border-collapse text-sm" {...domProps(props)} />
    </div>
  ),
};

export default function MarkdownMessage({ content }: { content: string }) {
  return (
    <div className="wrap-break-word text-[15px] leading-7 text-[#e3e3e3]">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
