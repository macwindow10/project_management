import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function GET() {
    try {
        const hardware = await prisma.hardware.findMany({
            include: {
                issuedTo: true,
            },
        });
        return NextResponse.json(hardware);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching hardware' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const hardware = await prisma.hardware.create({
            data: {
                name: data.name,
                description: data.description,
                dateOfPurchase: data.dateOfPurchase,
                issuedToId: data.issuedToId,
            },
            include: {
                issuedTo: true,
            },
        });
        return NextResponse.json(hardware);
    } catch (error) {
        return NextResponse.json({ error: 'Error creating hardware' }, { status: 500 });
    }
}