import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	try {
		const user = await getUser(req);
		if (!user)
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		// Get statistics in parallel for better performance
		const [totalPrompts, favoritePrompts, archivedPrompts, totalTags] =
			await Promise.all([
				prisma.prompt.count({ where: { userId: user.id } }),
				prisma.prompt.count({ where: { userId: user.id, isFavorite: true } }),
				prisma.prompt.count({ where: { userId: user.id, isArchived: true } }),
				prisma.tag.count({ where: { userId: user.id } }),
			]);

		return NextResponse.json({
			totalPrompts,
			favoritePrompts,
			archivedPrompts,
			totalTags,
			activePrompts: totalPrompts - archivedPrompts,
		});
	} catch (error) {
		console.error("Error fetching statistics:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
