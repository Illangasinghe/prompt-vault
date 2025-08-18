import { prisma } from "@/lib/prisma"
import { getUser } from "@/lib/auth"
import { z } from "zod"
import { NextRequest, NextResponse } from "next/server"

const CreateBody = z.object({
  title: z.string().min(1).max(200),
  body: z.string().min(1),
  tags: z.array(z.string()).optional()
})

export async function GET(req: NextRequest) {
  const user = await getUser(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q")?.trim()
  const fav = searchParams.get("fav") === "true"
  const archived = searchParams.get("archived") === "true"
  const sort = searchParams.get("sort") || "date"
  const take = Math.min(Number(searchParams.get("limit")) || 20, 100)
  const skip = Math.max(Number(searchParams.get("offset")) || 0, 0)

  const where = {
    userId: user.id,
    isFavorite: fav ? true : undefined,
    isArchived: archived ? true : false,
    OR: q
      ? [
          { title: { contains: q, mode: "insensitive" } },
          { body: { contains: q, mode: "insensitive" } }
        ]
      : undefined
  }

  // Dynamic sorting based on sort parameter
  const orderBy = sort === "title" 
    ? { title: "asc" } 
    : { updatedAt: "desc" }

  const prompts = await prisma.prompt.findMany({
    where,
    orderBy,
    take,
    skip,
    include: {
      tags: { include: { tag: true } }
    }
  })

  return NextResponse.json(prompts.map(p => ({
    id: p.id,
    title: p.title,
    body: p.body,
    isFavorite: p.isFavorite,
    isArchived: p.isArchived,
    tags: p.tags.map(t => t.tag.name),
    updatedAt: p.updatedAt
  })))
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUser(req)
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const json = await req.json()
    const parsed = CreateBody.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json(parsed.error.format(), { status: 422 })
    }

    const { title, body, tags = [] } = parsed.data

    const created = await prisma.$transaction(async tx => {
      const prompt = await tx.prompt.create({
        data: { title, body, userId: user.id }
      })

      if (tags.length) {
        const tagRows = await Promise.all(
          tags.map(name =>
            tx.tag.upsert({
              where: { userId_name: { userId: user.id, name } },
              update: {},
              create: { userId: user.id, name }
            })
          )
        )
        for (const t of tagRows) {
          await tx.promptTag.create({ data: { promptId: prompt.id, tagId: t.id } })
        }
      }
      return prompt
    })

    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    console.error("Error creating prompt:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
