import '@testing-library/jest-dom/vitest';
import React, { type AnchorHTMLAttributes, type ReactNode } from 'react';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
  localStorage.clear();
});

// next/link -> renderiza como <a> comum
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...rest
  }: { children: ReactNode; href: string } & AnchorHTMLAttributes<HTMLAnchorElement>) =>
    React.createElement('a', { href, ...rest }, children),
}));

// next/image -> renderiza como <img> comum removendo props especificas do Next
// para nao poluir o DOM com warnings do React em jsdom.
vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    const {
      src,
      alt,
      fill: _fill,
      priority: _priority,
      sizes: _sizes,
      unoptimized: _unoptimized,
      quality: _quality,
      placeholder: _placeholder,
      blurDataURL: _blur,
      loader: _loader,
      ...rest
    } = props;
    return React.createElement('img', { src, alt, ...rest });
  },
}));
