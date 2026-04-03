import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function shouldSkip(pathname: string): boolean {
  return (
    pathname.startsWith('/api')
    || pathname.startsWith('/admin')
    || pathname.startsWith('/_next')
    || pathname.startsWith('/favicon')
    || pathname.startsWith('/sitemap')
    || pathname.startsWith('/robots')
    || pathname.startsWith('/feed.xml')
  );
}

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;

  if (shouldSkip(pathname)) {
    return NextResponse.next();
  }

  const qs = new URLSearchParams({
    limit: '1',
    depth: '1',
    'where[from][equals]': pathname,
  });

  try {
    const res = await fetch(`${origin}/api/redirects?${qs.toString()}`, {
      headers: {
        cookie: request.headers.get('cookie') || '',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.next();
    }

    const json = (await res.json()) as {
      docs?: Array<{
        from?: string;
        to?: {
          type?: 'custom' | 'reference';
          url?: string;
          reference?: {
            relationTo?: string;
            value?: Record<string, unknown> | number | string;
          };
        };
      }>;
    };

    const redirect = json.docs?.[0];
    if (!redirect?.to) {
      return NextResponse.next();
    }

    if (redirect.to.type === 'custom' && typeof redirect.to.url === 'string' && redirect.to.url.length > 0) {
      return NextResponse.redirect(new URL(redirect.to.url, origin), 308);
    }

    const referenceValue = redirect.to.reference?.value;
    if (referenceValue && typeof referenceValue === 'object' && 'slug' in referenceValue) {
      const slug = referenceValue.slug;
      if (typeof slug === 'string' && slug.length > 0) {
        const relationTo = redirect.to.reference?.relationTo;
        const target = relationTo === 'pages' ? `/${slug}` : `/${relationTo}/${slug}`;
        return NextResponse.redirect(new URL(target, origin), 308);
      }
    }
  } catch {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$|.*\\.webp$).*)'],
};
