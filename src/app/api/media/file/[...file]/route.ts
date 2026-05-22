import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request, { params }: { params: Promise<{ file: string[] }> }) {
    const resolvedParams = await params;
    
    // Decode URI components to handle spaces and special characters like %20
    const decodedPathSegments = resolvedParams.file.map(segment => decodeURIComponent(segment));
    
    const filePath = path.join(process.cwd(), 'media', ...decodedPathSegments);
    
    if (!fs.existsSync(filePath)) {
        return new NextResponse('Not Found', { status: 404 });
    }
    
    try {
        const file = fs.readFileSync(filePath);
        
        // Guess mime type based on extension
        const ext = path.extname(filePath).toLowerCase();
        let contentType = 'application/octet-stream';
        if (ext === '.png') contentType = 'image/png';
        else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
        else if (ext === '.svg') contentType = 'image/svg+xml';
        else if (ext === '.gif') contentType = 'image/gif';
        else if (ext === '.webp') contentType = 'image/webp';
        else if (ext === '.pdf') contentType = 'application/pdf';
        
        return new NextResponse(file, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (error) {
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
