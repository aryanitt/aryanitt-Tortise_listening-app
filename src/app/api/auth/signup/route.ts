import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export async function POST(req: Request) {
    try {
        await connectDB();
        const { email, password, role } = await req.json();

        if (!email || !password || !role) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 409 }
            );
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({
            email,
            passwordHash,
            role,
        });

        return NextResponse.json(
            { message: "User created successfully", userId: user._id },
            { status: 201 }
        );
    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
