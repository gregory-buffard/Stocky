import {NextRequest, NextResponse} from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get('authToken');
    const url = req.nextUrl.clone();

    if (!token && !url.pathname.startsWith('/login') && !url.pathname.startsWith('/register')) {
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }
}