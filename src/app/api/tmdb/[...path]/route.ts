import { NextRequest, NextResponse } from 'next/server';
import { TMDB_API_URL, TMDB_LANGUAGE, TMDB_TOKEN, assertTmdbToken } from '@/lib/tmdbServer';

export const runtime = 'nodejs';

/**
 * Proxy transparente TMDB.
 * - Mantem o token no servidor (nunca expoe no bundle do cliente).
 * - Injeta language default caso o cliente nao envie.
 * - Preserva demais query params.
 * - Cacheia respostas com revalidacao curta (60s) usando o fetch do Next.
 */
async function handler(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  try {
    assertTmdbToken();

    const { path } = await ctx.params;
    const search = new URL(req.url).searchParams;
    if (!search.has('language')) {
      search.set('language', TMDB_LANGUAGE);
    }

    const upstream = `${TMDB_API_URL}/${path.join('/')}?${search.toString()}`;

    const res = await fetch(upstream, {
      headers: {
        Authorization: `Bearer ${TMDB_TOKEN}`,
        Accept: 'application/json',
      },
      next: { revalidate: 60 },
    });

    const body = await res.text();
    return new NextResponse(body, {
      status: res.status,
      headers: {
        'content-type': res.headers.get('content-type') ?? 'application/json',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro inesperado ao contatar o TMDB.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export { handler as GET };
