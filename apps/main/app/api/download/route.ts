import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const url = request.nextUrl.searchParams.get('url');
    const filename = request.nextUrl.searchParams.get('filename') ?? 'download';

    if (!url) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Security: only allow your cloudinary domain
    if (!url.startsWith('https://res.cloudinary.com/')) {
        return NextResponse.json({ error: 'Invalid URL' }, { status: 403 });
    }

    try {
        const response = await fetch(url);

        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to fetch file' }, { status: response.status });
        }

        const buffer = await response.arrayBuffer();
        const contentType = response.headers.get('content-type') ?? 'application/octet-stream';

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Cache-Control': 'no-store',
            },
        });
    } catch (error) {
        return NextResponse.json({ error: 'Download failed' }, { status: 500 });
    }
}