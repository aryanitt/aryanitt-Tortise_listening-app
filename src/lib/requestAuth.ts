import { verifyToken, type JwtPayload } from "@/lib/auth";

export async function getAuthFromRequest(req: Request): Promise<JwtPayload> {
    const authHeader = req.headers.get("authorization") || "";
    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
        throw new Error("Missing or invalid Authorization header");
    }

    const token = parts[1];
    return await verifyToken(token);
}

export function requireSupplier(payload: JwtPayload) {
    if (payload.role !== "supplier") throw new Error("Supplier access required");
}

export function requireEmployee(payload: JwtPayload) {
    if (payload.role !== "employee") throw new Error("Employee access required");
}
