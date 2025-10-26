import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { isValidProjectStatus } from '@/app/types';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const resolvedParams = await params;
        const project = await prisma.project.findUnique({
            where: { id: resolvedParams.id },
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
        const resolvedParams = await params;

        console.log('=== UPDATE PROJECT API ===');
        console.log('Project ID:', resolvedParams.id);
        console.log('Received attachments:', data.attachments);
        console.log('Attachments count:', data.attachments?.length || 0);

        if (!isValidProjectStatus(data.status)) {
            return NextResponse.json(
                { error: 'Invalid project status' },
                { status: 400 }
            );
        }

        // First, delete all existing attachments
        await prisma.projectAttachment.deleteMany({
            where: { projectId: resolvedParams.id },
        });

        const attachmentsToCreate = data.attachments?.map((attachment: any) => ({
            fileName: attachment.fileName,
            fileUrl: attachment.fileUrl,
            fileType: attachment.fileType,
            fileSize: attachment.fileSize,
        })) || [];

        console.log('Attachments to create:', attachmentsToCreate);

        const project = await prisma.project.update({
            where: { id: resolvedParams.id },
            data: {
                name: data.name,
                description: data.description,
                startDate: new Date(data.startDate),
                status: data.status,
                teamLeadId: data.teamLeadId,
                clientName: data.clientName,
                latestUpdate: data.latestUpdate,
                toolStack: data.toolStack,
                database: data.database,
                deploymentDetails: data.deploymentDetails,
                usersCount: data.usersCount,
                attachments: {
                    create: attachmentsToCreate,
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

        console.log('Updated project attachments:', project.attachments);
        console.log('=== END UPDATE PROJECT API ===');

        return NextResponse.json(project);
    } catch (error) {
        console.error('Error updating project:', error);
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