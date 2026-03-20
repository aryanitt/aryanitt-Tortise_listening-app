import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthFromRequest, requireSupplier } from "@/lib/requestAuth";
import { DeviceListing } from "@/models/DeviceListing";
import { StockLog } from "@/models/StockLog";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    await connectDB();

    try {
        const { id } = await params;
        const auth = await getAuthFromRequest(req);
        requireSupplier(auth);

        const body = await req.json();
        const quantityChange = Number(body.quantityChange || 0);
        const changeReason = String(body.changeReason || "");

        if (!quantityChange || Number.isNaN(quantityChange)) {
            return NextResponse.json({ ok: false, message: "quantityChange is required" }, { status: 400 });
        }

        const device = await DeviceListing.findById(id);
        if (!device) return NextResponse.json({ ok: false, message: "Device not found" }, { status: 404 });

        if (String(device.supplierId) !== auth.userId)
            return NextResponse.json({ ok: false, message: "Not allowed" }, { status: 403 });

        const newStock = device.stockQuantity + quantityChange;
        device.stockQuantity = Math.max(0, newStock);

        if (device.stockQuantity === 0) device.availabilityStatus = "out_of_stock";
        else device.availabilityStatus = "in_stock";

        await device.save();

        await StockLog.create({
            deviceId: device._id,
            supplierId: auth.userId,
            quantityChange,
            changeReason,
        });

        return NextResponse.json({ ok: true, device });
    } catch (e: any) {
        return NextResponse.json({ ok: false, message: e.message }, { status: 400 });
    }
}
