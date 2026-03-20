import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthFromRequest, requireSupplier } from "@/lib/requestAuth";
import { StockLog } from "@/models/StockLog";

export async function GET(req: Request) {
    await connectDB();

    try {
        const auth = await getAuthFromRequest(req);
        requireSupplier(auth);

        const logs = await StockLog.find({ supplierId: auth.userId })
            .sort({ createdAt: -1 })
            .limit(200);

        return NextResponse.json({ ok: true, logs });
    } catch (e: any) {
        return NextResponse.json({ ok: false, message: e.message }, { status: 401 });
    }
}
