import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const adminPaths = ['/admin_dashboard', '/edit_lesson', '/manage_students'];
const studentPaths = ['/student_dashboard', '/courses', '/grades', '/profile'];

function startsWithAny(pathname, paths) {
  return paths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

function roleHome(role) {
  if (role === 'admin') return '/admin_dashboard';
  if (role === 'student') return '/student_dashboard';
  return '/';
}

export async function proxy(req) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const role = token?.role;

  const isAuthPage = pathname.startsWith('/signin') || pathname.startsWith('/signup');
  const isProtected = startsWithAny(pathname, [...adminPaths, ...studentPaths]);

  if (token && isAuthPage) {
    const dashboardUrl = req.nextUrl.clone();
    dashboardUrl.pathname = roleHome(role);
    return NextResponse.redirect(dashboardUrl);
  }

  if (!token && isProtected) {
    const signInUrl = req.nextUrl.clone();
    signInUrl.pathname = '/signin';
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (startsWithAny(pathname, adminPaths) && role !== 'admin') {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = roleHome(role);
    return NextResponse.redirect(redirectUrl);
  }

  if (startsWithAny(pathname, studentPaths) && role !== 'student') {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = roleHome(role);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/signin',
    '/signup',
    '/admin_dashboard/:path*',
    '/student_dashboard/:path*',
    '/edit_lesson/:path*',
    '/manage_students/:path*',
    '/courses/:path*',
    '/grades/:path*',
    '/profile/:path*',
  ],
};
