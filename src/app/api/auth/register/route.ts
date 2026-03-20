import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { DeviceListing } from "@/models/DeviceListing";
import { calcFinalPrice } from "@/lib/pricing";

export async function POST() {
    await connectDB();

    const supplierEmail = "supplier@test.com";
    const employeeEmail = "employee@test.com";

    const supplierPassword = "Supplier@123";
    const employeePassword = "Employee@123";

    let supplier = await User.findOne({ email: supplierEmail });
    let employee = await User.findOne({ email: employeeEmail });

    if (!supplier) {
        const passwordHash = await bcrypt.hash(supplierPassword, 10);
        supplier = await User.create({ email: supplierEmail, passwordHash, role: "supplier" });
    }

    if (!employee) {
        const passwordHash = await bcrypt.hash(employeePassword, 10);
        employee = await User.create({ email: employeeEmail, passwordHash, role: "employee" });
    }

    // Seed devices if none exist for this supplier
    const deviceCount = await DeviceListing.countDocuments({ supplierId: supplier._id });
    if (deviceCount === 0) {
        const samples = [
            { name: "iPhone 15 Pro", brand: "Apple", basePrice: 120000, offerType: "percent", offerValue: 10, stockQuantity: 15 },
            { name: "Galaxy S24 Ultra", brand: "Samsung", basePrice: 110000, offerType: "flat", offerValue: 5000, stockQuantity: 10 },
            { name: "MacBook Air M3", brand: "Apple", basePrice: 99000, offerType: "none", offerValue: 0, stockQuantity: 8 },
            { name: "Pixel 8 Pro", brand: "Google", basePrice: 95000, offerType: "percent", offerValue: 15, stockQuantity: 20 },
            { name: "Dell XPS 13", brand: "Dell", basePrice: 130000, offerType: "flat", offerValue: 10000, stockQuantity: 5 },
            { name: "ThinkPad X1 Carbon", brand: "Lenovo", basePrice: 140000, offerType: "percent", offerValue: 5, stockQuantity: 12 },
        ];

        for (const s of samples) {
            const finalPrice = calcFinalPrice(s.basePrice, s.offerType as any, s.offerValue);
            await DeviceListing.create({
                ...s,
                supplierId: supplier._id,
                finalPrice,
                availabilityStatus: s.stockQuantity > 0 ? "in_stock" : "out_of_stock",
                description: `Premium ${s.name} by ${s.brand}. High performance and sleek design.`,
                imageUrl: `https://placehold.co/600x400?text=${encodeURIComponent(s.name)}`,
            });
        }
    }

    return NextResponse.json({
        ok: true,
        message: "Seed users and devices ensured",
        users: [
            { role: "supplier", email: supplierEmail, password: supplierPassword },
            { role: "employee", email: employeeEmail, password: employeePassword },
        ],
    });
}
