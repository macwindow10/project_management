import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const hardware = await prisma.hardware.findUnique({
            where: { id: params.id },
            include: {
                issuedTo: true,
            },
        });

        if (!hardware) {
            return NextResponse.json({ error: 'Hardware not found' }, { status: 404 });
        }

        return NextResponse.json(hardware);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching hardware' }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const data = await request.json();
        const hardware = await prisma.hardware.update({
            where: { id: params.id },
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
        return NextResponse.json({ error: 'Error updating hardware' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.hardware.delete({
            where: { id: params.id },
        });
        return NextResponse.json({ message: 'Hardware deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting hardware' }, { status: 500 });
    }
}