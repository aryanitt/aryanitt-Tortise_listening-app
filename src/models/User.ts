import mongoose, { Schema, Document, Model } from "mongoose";

export type UserRole = "supplier" | "employee";

export interface IUser extends Document {
    email: string;
    passwordHash: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        passwordHash: { type: String, required: true },
        role: { type: String, enum: ["supplier", "employee"], required: true },
    },
    { timestamps: true }
);

export const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
