import type { OfferType } from "@/models/DeviceListing";

export function calcFinalPrice(basePrice: number, offerType: OfferType, offerValue: number) {
    const bp = Math.max(0, Number(basePrice || 0));
    const ov = Math.max(0, Number(offerValue || 0));

    if (offerType === "percent") {
        const discount = (bp * ov) / 100;
        return Math.max(0, Math.round((bp - discount) * 100) / 100);
    }

    if (offerType === "flat") {
        return Math.max(0, Math.round((bp - ov) * 100) / 100);
    }

    return Math.max(0, Math.round(bp * 100) / 100);
}
