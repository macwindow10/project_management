import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { isValidPersonRole } from '@/app/types';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const person = await prisma.person.findUnique({
            where: { id: params.id },
            include: {
                leadingProjects: true,
                memberOfProjects: true,
                assignedHardware: true,
            },
        });

        if (!person) {
            return NextResponse.json({ error: 'Person not found' }, { status: 404 });
        }

        return NextResponse.json(person);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching person' }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const data = await request.json();
        const resolvedParams = await params;

        console.log('=== UPDATE PERSON API ===');
        console.log('Person ID:', resolvedParams.id);
        console.log('Received data:', data);
        console.log('Picture URL:', data.picture);

        if (!isValidPersonRole(data.role)) {
            return NextResponse.json(
                { error: 'Invalid person role' },
                { status: 400 }
            );
        }

        const person = await prisma.person.update({
            where: { id: resolvedParams.id },
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
        
        console.log('Updated person:', person);
        console.log('Saved picture URL:', person.picture);
        console.log('=== END UPDATE PERSON API ===');
        
        return NextResponse.json(person);
    } catch (error) {
        console.error('Error updating person:', error);
        return NextResponse.json({ error: 'Error updating person' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.person.delete({
            where: { id: params.id },
        });
        return NextResponse.json({ message: 'Person deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting person' }, { status: 500 });
    }
}