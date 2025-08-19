import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { signUp, createToken } from "@/lib/auth";

const SignUpSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
	name: z.string().min(1).optional(),
});

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { email, password, name } = SignUpSchema.parse(body);

		const user = await signUp(email, password, name);
		if (!user) {
			return NextResponse.json(
				{ error: "Email already exists" },
				{ status: 400 },
			);
		}

		const token = await createToken(user);

		const response = NextResponse.json({
			user: { id: user.id, email: user.email, name: user.name },
		});
		response.cookies.set("auth-token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 60 * 60 * 24, // 24 hours
		});

		return response;
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: "Invalid input" }, { status: 400 });
		}
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
