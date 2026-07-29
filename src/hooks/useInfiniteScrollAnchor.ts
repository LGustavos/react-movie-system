'use client';

import { useEffect, useRef } from 'react';

interface Options {
  onIntersect: () => void;
  enabled?: boolean;
  rootMargin?: string;
}

/**
 * Cria um ref para ser posicionado no "sentinel" ao fim da lista.
 * Dispara `onIntersect` quando ele entra na viewport.
 */
export function useInfiniteScrollAnchor({
  onIntersect,
  enabled = true,
  rootMargin = '600px',
}: Options) {
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const callbackRef = useRef(onIntersect);

  useEffect(() => {
    callbackRef.current = onIntersect;
  }, [onIntersect]);

  useEffect(() => {
    if (!enabled) return;
    const node = anchorRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            callbackRef.current();
          }
        }
      },
      { rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled, rootMargin]);

  return anchorRef;
}
