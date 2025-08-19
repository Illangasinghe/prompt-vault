import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
	try {
		const user = await getUser(req);
		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		return NextResponse.json({
			id: user.id,
			email: user.email,
			name: user.name,
		});
	} catch (error) {
		console.error("Error fetching user:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
