import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
    await connectDB();

    const body = await req.json();
    const email = String(body.email || "").toLowerCase().trim();
    const password = String(body.password || "");

    if (!email || !password) {
        return NextResponse.json({ ok: false, message: "Email and password required" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return NextResponse.json({ ok: false, message: "Invalid credentials" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
        return NextResponse.json({ ok: false, message: "Invalid credentials" }, { status: 401 });
    }

    const token = await signToken({ userId: String(user._id), role: user.role });

    return NextResponse.json({
        ok: true,
        token,
        role: user.role,
        user: { id: String(user._id), email: user.email, role: user.role },
    });
}
