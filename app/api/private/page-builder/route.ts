import { NextResponse } from 'next/server';
import { getPageBuilderData } from '@/lib/page-builder.lib';

export async function GET(req: Request) {
    try {
        const data = await getPageBuilderData();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Page builder fetch error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Internal server error';
        const status = errorMessage.includes('Unauthorized') ? 401 
            : errorMessage.includes('Access denied') ? 403
            : errorMessage.includes('not found') ? 404
            : errorMessage.includes('required') ? 400
            : 500;
        return NextResponse.json({ error: errorMessage }, { status });
    }
}

