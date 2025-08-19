import { NextResponse } from "next/server";

export async function POST() {
	const response = NextResponse.json({ message: "Signed out successfully" });
	response.cookies.delete("auth-token");
	return response;
}

export async function GET() {
	const response = NextResponse.redirect(
		new URL("/signin", process.env.NEXTAUTH_URL || "http://localhost:3000"),
	);
	response.cookies.delete("auth-token");
	return response;
}
