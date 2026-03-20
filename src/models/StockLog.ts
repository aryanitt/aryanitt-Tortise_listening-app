import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IStockLog extends Document {
    deviceId: Types.ObjectId;
    supplierId: Types.ObjectId;
    quantityChange: number;
    changeReason: string;
    createdAt: Date;
    updatedAt: Date;
}

const StockLogSchema = new Schema<IStockLog>(
    {
        deviceId: { type: Schema.Types.ObjectId, ref: "DeviceListing", required: true },
        supplierId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        quantityChange: { type: Number, required: true },
        changeReason: { type: String, default: "" },
    },
    { timestamps: true }
);

export const StockLog: Model<IStockLog> =
    mongoose.models.StockLog || mongoose.model<IStockLog>("StockLog", StockLogSchema);
