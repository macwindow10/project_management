import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const resolvedParams = await params;
    const projectId = resolvedParams.id;
    const { teamMemberIds } = await req.json();

    if (!Array.isArray(teamMemberIds)) {
        return NextResponse.json({ error: "teamMemberIds must be an array" }, { status: 400 });
    }

    // Remove existing team members for this project
    await prisma.teamMember.deleteMany({ where: { projectId } });

    // Add new team members, checking for existing manually
    for (const personId of teamMemberIds) {
        const exists = await prisma.teamMember.findFirst({ where: { personId, projectId } });
        if (!exists) {
            await prisma.teamMember.create({ data: { personId, projectId } });
        }
    }

    return NextResponse.json({ success: true });
}
