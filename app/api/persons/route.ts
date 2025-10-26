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

        console.log('=== CREATE PERSON API ===');
        console.log('Received data:', data);
        console.log('Picture URL:', data.picture);

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
        
        console.log('Created person:', person);
        console.log('Saved picture URL:', person.picture);
        console.log('=== END CREATE PERSON API ===');
        
        return NextResponse.json(person);
    } catch (error) {
        console.error('Error creating person:', error);
        return NextResponse.json({ error: 'Error creating person' }, { status: 500 });
    }
}