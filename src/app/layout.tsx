import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Suspense, type ReactNode } from 'react';
import { AuroraBackground } from '@/components/AuroraBackground';
import { Header } from '@/components/Header';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'MovieDB - Descubra novos filmes',
    template: '%s - MovieDB',
  },
  description:
    'Explore filmes populares, busque títulos e organize sua lista de favoritos com dados do TMDB.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="font-sans">
        <AuroraBackground />
        <FavoritesProvider>
          <Suspense fallback={null}>
            <Header />
          </Suspense>
          <main className="container-page py-6">{children}</main>
        </FavoritesProvider>
      </body>
    </html>
  );
}
