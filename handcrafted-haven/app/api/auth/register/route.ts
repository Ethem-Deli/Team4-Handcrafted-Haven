import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      password,
      role, // "SELLER" or "BUYER"
      storeName,
      craftDescription,
    } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Email already registered." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role, // must match the Role enum ("SELLER" / "BUYER")
        storeName: role === "SELLER" ? storeName ?? "" : null,
        craftDescription:
          role === "SELLER" ? craftDescription ?? "" : null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully.",
        user: { id: user.id, email: user.email, role: user.role },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("REGISTER ERROR", err);
    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 }
    );
  }
}