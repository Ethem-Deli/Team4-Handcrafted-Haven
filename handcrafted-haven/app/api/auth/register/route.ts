import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      password,
      role,
      storeName,
      craftDescription,
    } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, message: "Name, email and password are required." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User with this email already exists." },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    const normalizedRole =
      role && role.toLowerCase() === "customer" ? "BUYER" : "SELLER";

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: normalizedRole,
        storeName: normalizedRole === "SELLER" ? storeName : null,
        craftDescription:
          normalizedRole === "SELLER" ? craftDescription : null,
      },
    });

    return NextResponse.json(
      { success: true, message: "Account created successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server error occurred" },
      { status: 500 }
    );
  }
}
