import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { isValidPersonRole } from '@/app/types';

export async function GET() {
    try {
        const persons = await prisma.person.findMany({
            include: {
                leadingProjects: true,
                memberOfProjects: true,
                assignedHardware: true,
            },
        });
        return NextResponse.json(persons);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching persons' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        if (!isValidPersonRole(data.role)) {
            return NextResponse.json(
                { error: 'Invalid person role' },
                { status: 400 }
            );
        }

        const person = await prisma.person.create({
            data: {
                name: data.name,
                role: data.role,
                picture: data.picture,
            },
            include: {
                leadingProjects: true,
                memberOfProjects: true,
                assignedHardware: true,
            },
        });
        return NextResponse.json(person);
    } catch (error) {
        return NextResponse.json({ error: 'Error creating person' }, { status: 500 });
    }
}