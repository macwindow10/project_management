import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const tasks = await prisma.task.findMany({
            include: {
                project: true,
                person: true,
            },
        });
        return NextResponse.json(tasks);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching tasks' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const task = await prisma.task.create({
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
        return NextResponse.json({ error: 'Error creating task' }, { status: 500 });
    }
}
