import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { DeviceListing } from "@/models/DeviceListing";

export async function GET(req: Request) {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const q = String(searchParams.get("q") || "").trim();

    const filter: any = {
        availabilityStatus: "in_stock",
        stockQuantity: { $gt: 0 },
    };

    if (q) {
        filter.$or = [
            { name: { $regex: q, $options: "i" } },
            { brand: { $regex: q, $options: "i" } },
        ];
    }

    const devices = await DeviceListing.find(filter).sort({ createdAt: -1 });

    return NextResponse.json({ ok: true, devices });
}
