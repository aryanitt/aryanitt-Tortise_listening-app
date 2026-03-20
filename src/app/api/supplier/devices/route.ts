import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthFromRequest, requireSupplier } from "@/lib/requestAuth";
import { DeviceListing } from "@/models/DeviceListing";
import { calcFinalPrice } from "@/lib/pricing";

export async function GET(req: Request) {
    await connectDB();

    try {
        const auth = await getAuthFromRequest(req);
        requireSupplier(auth);

        const devices = await DeviceListing.find({ supplierId: auth.userId }).sort({ createdAt: -1 });
        return NextResponse.json({ ok: true, devices });
    } catch (e: any) {
        return NextResponse.json({ ok: false, message: e.message }, { status: 401 });
    }
}

export async function POST(req: Request) {
    await connectDB();

    try {
        const auth = await getAuthFromRequest(req);
        requireSupplier(auth);

        const body = await req.json();

        const basePrice = Number(body.basePrice || 0);
        const offerType = body.offerType || "none";
        const offerValue = Number(body.offerValue || 0);
        const finalPrice = calcFinalPrice(basePrice, offerType, offerValue);

        const created = await DeviceListing.create({
            supplierId: auth.userId,
            name: String(body.name || ""),
            brand: String(body.brand || ""),
            description: String(body.description || ""),
            imageUrl: String(body.imageUrl || ""),
            basePrice,
            offerType,
            offerValue,
            finalPrice,
            stockQuantity: Number(body.stockQuantity || 0),
            availabilityStatus: body.availabilityStatus || "in_stock",
        });

        return NextResponse.json({ ok: true, device: created });
    } catch (e: any) {
        return NextResponse.json({ ok: false, message: e.message }, { status: 400 });
    }
}
