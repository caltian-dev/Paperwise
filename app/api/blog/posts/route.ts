import { executeQuery } from "@/lib/db"
import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

export async function GET() {
  try {
    // Get all blog posts with their categories
    const posts = await executeQuery(`
      SELECT 
        p.*, 
        COALESCE(
          json_agg(
            json_build_object('id', c.id, 'name', c.name)
          ) FILTER (WHERE c.id IS NOT NULL), 
          '[]'
        ) as categories
      FROM "BlogPost" p
      LEFT JOIN "BlogPostCategory" pc ON p.id = pc."postId"
      LEFT JOIN "BlogCategory" c ON pc."categoryId" = c.id
      GROUP BY p.id
      ORDER BY p."createdAt" DESC
    `)

    return NextResponse.json(posts)
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { title, slug, excerpt, content, published, coverImage, categoryIds } = await request.json()

    // Validate required fields
    if (!title || !slug || !content) {
      return NextResponse.json({ message: "Title, slug, and content are required" }, { status: 400 })
    }

    // Check if slug is already in use
    const existingPost = await executeQuery(`SELECT id FROM "BlogPost" WHERE slug = $1`, [slug])

    if (existingPost.length > 0) {
      return NextResponse.json({ message: "A post with this slug already exists" }, { status: 400 })
    }

    // Create new post
    const postId = uuidv4()
    await executeQuery(
      `INSERT INTO "BlogPost" (id, title, slug, excerpt, content, published, "coverImage")
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [postId, title, slug, excerpt, content, published, coverImage],
    )

    // Add categories if provided
    if (categoryIds && categoryIds.length > 0) {
      for (const categoryId of categoryIds) {
        await executeQuery(`INSERT INTO "BlogPostCategory" ("postId", "categoryId") VALUES ($1, $2)`, [
          postId,
          categoryId,
        ])
      }
    }

    return NextResponse.json({ id: postId, message: "Post created successfully" }, { status: 201 })
  } catch (error) {
    console.error("Error creating blog post:", error)
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 })
  }
}
