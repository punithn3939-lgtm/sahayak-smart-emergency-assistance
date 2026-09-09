import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        }
      }
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  if (!user && path.startsWith('/dashboard')) return NextResponse.redirect(new URL('/login', request.url));
  if (!user && path.startsWith('/hospital') && !path.startsWith('/hospital/login') && !path.startsWith('/hospital/signup')) return NextResponse.redirect(new URL('/hospital/login', request.url));

  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role,hospital_id').eq('id', user.id).maybeSingle();
    const hospitalStaff = profile?.role === 'hospital_staff' && !!profile?.hospital_id;
    if (hospitalStaff && ['/login','/signup'].includes(path)) return NextResponse.redirect(new URL('/hospital', request.url));
    if (hospitalStaff && ['/hospital/login','/hospital/signup'].includes(path)) return NextResponse.redirect(new URL('/hospital', request.url));
    if (hospitalStaff && path.startsWith('/dashboard')) return NextResponse.redirect(new URL('/hospital', request.url));
  }

  return response;
}
