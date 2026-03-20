import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthFromRequest, requireSupplier } from "@/lib/requestAuth";
import { DeviceListing } from "@/models/DeviceListing";
import { calcFinalPrice } from "@/lib/pricing";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    await connectDB();

    try {
        const { id } = await params;
        const auth = await getAuthFromRequest(req);
        requireSupplier(auth);

        const body = await req.json();
        const device = await DeviceListing.findById(id);

        if (!device) return NextResponse.json({ ok: false, message: "Device not found" }, { status: 404 });
        if (String(device.supplierId) !== auth.userId)
            return NextResponse.json({ ok: false, message: "Not allowed" }, { status: 403 });

        const basePrice = body.basePrice !== undefined ? Number(body.basePrice) : device.basePrice;
        const offerType = body.offerType !== undefined ? body.offerType : device.offerType;
        const offerValue = body.offerValue !== undefined ? Number(body.offerValue) : device.offerValue;
        const finalPrice = calcFinalPrice(basePrice, offerType, offerValue);

        device.name = body.name !== undefined ? String(body.name) : device.name;
        device.brand = body.brand !== undefined ? String(body.brand) : device.brand;
        device.description = body.description !== undefined ? String(body.description) : device.description;
        device.imageUrl = body.imageUrl !== undefined ? String(body.imageUrl) : device.imageUrl;

        device.basePrice = basePrice;
        device.offerType = offerType;
        device.offerValue = offerValue;
        device.finalPrice = finalPrice;

        device.stockQuantity =
            body.stockQuantity !== undefined ? Number(body.stockQuantity) : device.stockQuantity;

        device.availabilityStatus =
            body.availabilityStatus !== undefined ? body.availabilityStatus : device.availabilityStatus;

        await device.save();

        return NextResponse.json({ ok: true, device });
    } catch (e: any) {
        return NextResponse.json({ ok: false, message: e.message }, { status: 400 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    await connectDB();

    try {
        const { id } = await params;
        const auth = await getAuthFromRequest(req);
        requireSupplier(auth);

        const device = await DeviceListing.findById(id);
        if (!device) return NextResponse.json({ ok: false, message: "Device not found" }, { status: 404 });

        if (String(device.supplierId) !== auth.userId)
            return NextResponse.json({ ok: false, message: "Not allowed" }, { status: 403 });

        await DeviceListing.deleteOne({ _id: id });

        return NextResponse.json({ ok: true });
    } catch (e: any) {
        return NextResponse.json({ ok: false, message: e.message }, { status: 400 });
    }
}
