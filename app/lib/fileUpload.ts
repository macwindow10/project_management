import { writeFile } from 'fs/promises';
import { join } from 'path';

export interface SavedFileInfo {
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
}

export async function saveFile(file: File): Promise<SavedFileInfo> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename
    const filename = `${Date.now()}-${file.name}`;
    const relativePath = `uploads/${filename}`;
    const path = join(process.cwd(), 'public', relativePath);

    // Save the file
    await writeFile(path, buffer);

    return {
        fileName: file.name,
        fileUrl: `/${relativePath}`,
        fileType: file.type,
        fileSize: file.size,
    };
}

export async function saveFiles(files: File[]): Promise<SavedFileInfo[]> {
    const promises = files.map(file => saveFile(file));
    return Promise.all(promises);
}