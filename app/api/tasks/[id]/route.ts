import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const task = await prisma.task.findUnique({
            where: { id: params.id },
            include: {
                project: true,
                person: true,
            },
        });
        if (!task) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }
        return NextResponse.json(task);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching task' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const data = await request.json();
        const resolvedParams = await params;
        const task = await prisma.task.update({
            where: { id: resolvedParams.id },
            data: {
                projectId: data.projectId,
                personId: data.personId,
                title: data.title,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
                status: data.status,
            },
            include: {
                project: true,
                person: true,
            },
        });
        return NextResponse.json(task);
    } catch (error) {
        return NextResponse.json({ error: 'Error updating task' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        await prisma.task.delete({
            where: { id: params.id },
        });
        return NextResponse.json({ message: 'Task deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting task' }, { status: 500 });
    }
}
