import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const UpdatePromptSchema = z.object({
	title: z.string().min(1).max(200).optional(),
	body: z.string().min(1).optional(),
	tags: z.array(z.string()).optional(),
	isFavorite: z.boolean().optional(),
	isArchived: z.boolean().optional(),
});

// GET single prompt
export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const user = await getUser(req);
		if (!user)
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		const prompt = await prisma.prompt.findFirst({
			where: { id: params.id, userId: user.id },
			include: { tags: { include: { tag: true } } },
		});

		if (!prompt) {
			return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
		}

		return NextResponse.json({
			id: prompt.id,
			title: prompt.title,
			body: prompt.body,
			isFavorite: prompt.isFavorite,
			isArchived: prompt.isArchived,
			tags: prompt.tags.map((t) => t.tag.name),
			updatedAt: prompt.updatedAt,
		});
	} catch (error) {
		console.error("Error fetching prompt:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

// PUT update prompt
export async function PUT(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const user = await getUser(req);
		if (!user)
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		const json = await req.json();
		const parsed = UpdatePromptSchema.parse(json);

		// Check if prompt exists and belongs to user
		const existingPrompt = await prisma.prompt.findFirst({
			where: { id: params.id, userId: user.id },
		});

		if (!existingPrompt) {
			return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
		}

		const updated = await prisma.$transaction(async (tx) => {
			// Update prompt
			const prompt = await tx.prompt.update({
				where: { id: params.id },
				data: {
					...(parsed.title !== undefined && { title: parsed.title }),
					...(parsed.body !== undefined && { body: parsed.body }),
					...(parsed.isFavorite !== undefined && {
						isFavorite: parsed.isFavorite,
					}),
					...(parsed.isArchived !== undefined && {
						isArchived: parsed.isArchived,
					}),
				},
			});

			// Handle tags if provided
			if (parsed.tags !== undefined) {
				// Remove existing tags
				await tx.promptTag.deleteMany({
					where: { promptId: params.id },
				});

				// Add new tags
				if (parsed.tags.length > 0) {
					const tagRows = await Promise.all(
						parsed.tags.map((name) =>
							tx.tag.upsert({
								where: { userId_name: { userId: user.id, name } },
								update: {},
								create: { userId: user.id, name },
							}),
						),
					);

					for (const tag of tagRows) {
						await tx.promptTag.create({
							data: { promptId: prompt.id, tagId: tag.id },
						});
					}
				}
			}

			return prompt;
		});

		return NextResponse.json(updated);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: "Invalid input" }, { status: 400 });
		}
		console.error("Error updating prompt:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

// DELETE prompt
export async function DELETE(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const user = await getUser(req);
		if (!user)
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		// Check if prompt exists and belongs to user
		const existingPrompt = await prisma.prompt.findFirst({
			where: { id: params.id, userId: user.id },
		});

		if (!existingPrompt) {
			return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
		}

		await prisma.$transaction(async (tx) => {
			// Delete prompt tags first (foreign key constraint)
			await tx.promptTag.deleteMany({
				where: { promptId: params.id },
			});

			// Delete the prompt
			await tx.prompt.delete({
				where: { id: params.id },
			});
		});

		return NextResponse.json({ message: "Prompt deleted successfully" });
	} catch (error) {
		console.error("Error deleting prompt:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
