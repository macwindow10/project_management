import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { isValidProjectStatus } from '@/app/types';

export async function GET() {
    try {
        const projects = await prisma.project.findMany({
            include: {
                teamLead: true,
                teamMembers: true,
                attachments: true,
            },
        });
        return NextResponse.json(projects);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching projects' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        if (!isValidProjectStatus(data.status)) {
            return NextResponse.json(
                { error: 'Invalid project status' },
                { status: 400 }
            );
        }

        const project = await prisma.project.create({
            data: {
                name: data.name,
                description: data.description,
                startDate: new Date(data.startDate),
                status: data.status,
                teamLeadId: data.teamLeadId,
                clientName: data.clientName,
                latestUpdate: data.latestUpdate,
                attachments: {
                    create: data.attachments?.map((attachment: any) => ({
                        fileName: attachment.fileName,
                        fileUrl: attachment.fileUrl,
                        fileType: attachment.fileType,
                        fileSize: attachment.fileSize,
                    })) || [],
                },
                teamMembers: {
                    connect: data.teamMemberIds?.map((id: string) => ({ id })) || [],
                },
            },
            include: {
                teamLead: true,
                teamMembers: true,
                attachments: true,
            },
        });
        return NextResponse.json(project);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error creating project' }, { status: 500 });
    }
}