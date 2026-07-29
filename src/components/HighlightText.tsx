import { useMemo } from 'react';

interface HighlightTextProps {
  text: string;
  highlight?: string;
  className?: string;
}

function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Renderiza `text` destacando ocorrencias (case-insensitive) de `highlight`.
 * Se `highlight` for vazio, renderiza somente o texto.
 */
export function HighlightText({ text, highlight, className }: HighlightTextProps) {
  const parts = useMemo(() => {
    const term = highlight?.trim();
    if (!term) return [{ value: text, match: false }];
    const regex = new RegExp(`(${escapeRegExp(term)})`, 'ig');
    return text.split(regex).map((chunk) => ({
      value: chunk,
      match: chunk.toLowerCase() === term.toLowerCase(),
    }));
  }, [text, highlight]);

  return (
    <span className={className}>
      {parts.map((part, i) =>
        part.match ? (
          <mark key={i} className="rounded bg-accent-400/90 px-1 text-surface-950">
            {part.value}
          </mark>
        ) : (
          <span key={i}>{part.value}</span>
        ),
      )}
    </span>
  );
}
