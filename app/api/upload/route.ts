import { NextRequest, NextResponse } from 'next/server';
import { saveFiles, SavedFileInfo } from '@/app/lib/fileUpload';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const files = formData.getAll('files') as File[];

        if (files.length === 0) {
            return NextResponse.json(
                { error: 'No files provided' },
                { status: 400 }
            );
        }

        const fileInfos: SavedFileInfo[] = await saveFiles(files);
        console.log('Uploaded files info:', fileInfos);
        return NextResponse.json({ files: fileInfos });
    } catch (error) {
        console.error('Error uploading files:', error);
        return NextResponse.json(
            { error: 'Error uploading files' },
            { status: 500 }
        );
    }
}