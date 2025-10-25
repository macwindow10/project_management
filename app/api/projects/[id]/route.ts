import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { isValidProjectStatus } from '@/app/types';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const project = await prisma.project.findUnique({
            where: { id: params.id },
            include: {
                teamLead: true,
                teamMembers: true,
                attachments: true,
            },
        });

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json(project);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching project' }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const data = await request.json();

        if (!isValidProjectStatus(data.status)) {
            return NextResponse.json(
                { error: 'Invalid project status' },
                { status: 400 }
            );
        }

        // First, delete all existing attachments
        await prisma.projectAttachment.deleteMany({
            where: { projectId: params.id },
        });

        const project = await prisma.project.update({
            where: { id: params.id },
            data: {
                name: data.name,
                description: data.description,
                startDate: data.startDate,
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
                    set: data.teamMemberIds?.map((id: string) => ({ id })) || [],
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
        return NextResponse.json({ error: 'Error updating project' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Project attachments will be automatically deleted due to the onDelete: Cascade setting
        await prisma.project.delete({
            where: { id: params.id },
        });
        return NextResponse.json({ message: 'Project deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting project' }, { status: 500 });
    }
}