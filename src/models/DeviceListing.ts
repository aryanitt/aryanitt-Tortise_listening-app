import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type OfferType = "none" | "percent" | "flat";
export type AvailabilityStatus = "in_stock" | "out_of_stock";

export interface IDeviceListing extends Document {
    supplierId: Types.ObjectId;
    name: string;
    brand: string;
    description: string;
    imageUrl: string;
    basePrice: number;
    offerType: OfferType;
    offerValue: number;
    finalPrice: number;
    stockQuantity: number;
    availabilityStatus: AvailabilityStatus;
    createdAt: Date;
    updatedAt: Date;
}

const DeviceListingSchema = new Schema<IDeviceListing>(
    {
        supplierId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        name: { type: String, required: true, trim: true },
        brand: { type: String, required: true, trim: true },
        description: { type: String, default: "" },
        imageUrl: { type: String, default: "" },

        basePrice: { type: Number, required: true, min: 0 },
        offerType: { type: String, enum: ["none", "percent", "flat"], default: "none" },
        offerValue: { type: Number, default: 0, min: 0 },

        finalPrice: { type: Number, required: true, min: 0 },

        stockQuantity: { type: Number, required: true, min: 0 },
        availabilityStatus: { type: String, enum: ["in_stock", "out_of_stock"], default: "in_stock" },
    },
    { timestamps: true }
);

export const DeviceListing: Model<IDeviceListing> =
    mongoose.models.DeviceListing ||
    mongoose.model<IDeviceListing>("DeviceListing", DeviceListingSchema);
