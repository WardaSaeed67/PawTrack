import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const petData = await prisma.petData.findUnique({
      where: { userId }
    });

    if (!petData) {
      return NextResponse.json({
        pets: [],
        currentPetId: "",
        theme: "warm",
        weightLogs: [],
        tasks: [],
        expenses: [],
        vetAppointments: [],
        documents: []
      });
    }

    return NextResponse.json(petData.data);
  } catch (error) {
    console.error("GET petData error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const data = await request.json();

    const petData = await prisma.petData.upsert({
      where: { userId },
      update: { data },
      create: { userId, data }
    });

    return NextResponse.json({ success: true, updatedAt: petData.updatedAt });
  } catch (error) {
    console.error("POST petData error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
