import { NextResponse , NextRequest } from "next/server";
export { default } from "next-auth/middleware"
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
    const token = await getToken({req: req});
    const url = req.nextUrl;

    if(token && (
        url.pathname.startsWith('/signin') ||
        url.pathname.startsWith('/signup') ||
        url.pathname.startsWith('/token') ||
        url.pathname.startsWith('/')
    )){
        return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    if(!token && url.pathname.startsWith('/dashboard')){
        return NextResponse.redirect(new URL('/signin', req.url))
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/signin',
        '/signup',
        '/',
        '/verify/:path*',
        '/dashboard/:path*',
    ]
}