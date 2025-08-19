import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { prisma } from "./prisma";

const secret = new TextEncoder().encode(
	process.env.JWT_SECRET || "your-secret-key",
);

export interface User {
	id: string;
	email: string;
	name?: string | null;
}

export async function hashPassword(password: string): Promise<string> {
	return await bcrypt.hash(password, 12);
}

export async function verifyPassword(
	password: string,
	hashedPassword: string,
): Promise<boolean> {
	return await bcrypt.compare(password, hashedPassword);
}

export async function createToken(user: User): Promise<string> {
	return await new SignJWT({ userId: user.id, email: user.email })
		.setProtectedHeader({ alg: "HS256" })
		.setExpirationTime("24h")
		.sign(secret);
}

export async function verifyToken(token: string): Promise<User | null> {
	try {
		const { payload } = await jwtVerify(token, secret);
		return {
			id: payload.userId as string,
			email: payload.email as string,
			name: null,
		};
	} catch {
		return null;
	}
}

export async function getUser(req?: NextRequest): Promise<User | null> {
	try {
		let token: string | undefined;

		if (req) {
			// For API routes
			token = req.cookies.get("auth-token")?.value;
		} else {
			// For server components
			const cookieStore = await cookies();
			token = cookieStore.get("auth-token")?.value;
		}

		if (!token) return null;

		const user = await verifyToken(token);
		if (!user) return null;

		// Fetch full user data from database
		const dbUser = await prisma.user.findUnique({
			where: { id: user.id },
			select: { id: true, email: true, name: true },
		});

		return dbUser;
	} catch {
		return null;
	}
}

export async function signIn(
	email: string,
	password: string,
): Promise<User | null> {
	try {
		const user = await prisma.user.findUnique({
			where: { email },
			select: { id: true, email: true, name: true, password: true },
		});

		if (!user) return null;

		const isValid = await verifyPassword(password, user.password);
		if (!isValid) return null;

		return { id: user.id, email: user.email, name: user.name };
	} catch {
		return null;
	}
}

export async function signUp(
	email: string,
	password: string,
	name?: string,
): Promise<User | null> {
	try {
		const hashedPassword = await hashPassword(password);

		const user = await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
				name: name || null,
			},
			select: { id: true, email: true, name: true },
		});

		return user;
	} catch {
		return null;
	}
}
