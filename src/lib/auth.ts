import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET!;

if (!JWT_SECRET) {
    throw new Error("Missing JWT_SECRET in environment variables.");
}

export type UserRole = "supplier" | "employee";

export type JwtPayload = {
    userId: string;
    role: UserRole;
    // Standard claims
    iat?: number;
    exp?: number;
};

// Encode secret key for jose
const encodedKey = new TextEncoder().encode(JWT_SECRET);

export async function signToken(payload: Omit<JwtPayload, "iat" | "exp">) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(encodedKey);
}

export async function verifyToken(token: string): Promise<JwtPayload> {
    const { payload } = await jwtVerify(token, encodedKey, {
        algorithms: ["HS256"],
    });
    return payload as JwtPayload;
}
