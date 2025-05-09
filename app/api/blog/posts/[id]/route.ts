import { executeQuery } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Get blog post with its categories
    const posts = await executeQuery(
      `SELECT 
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
      WHERE p.id = $1
      GROUP BY p.id`,
      [params.id],
    )

    if (posts.length === 0) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 })
    }

    return NextResponse.json(posts[0])
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return NextResponse.json({ error: "Failed to fetch blog post" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { title, slug, excerpt, content, published, coverImage, categoryIds } = await request.json()

    // Validate required fields
    if (!title || !slug || !content) {
      return NextResponse.json({ message: "Title, slug, and content are required" }, { status: 400 })
    }

    // Check if slug is already in use by another post
    const existingPost = await executeQuery(`SELECT id FROM "BlogPost" WHERE slug = $1 AND id != $2`, [slug, params.id])

    if (existingPost.length > 0) {
      return NextResponse.json({ message: "A post with this slug already exists" }, { status: 400 })
    }

    // Update post
    await executeQuery(
      `UPDATE "BlogPost" 
       SET title = $1, slug = $2, excerpt = $3, content = $4, published = $5, "coverImage" = $6, "updatedAt" = CURRENT_TIMESTAMP
       WHERE id = $7`,
      [title, slug, excerpt, content, published, coverImage, params.id],
    )

    // Delete existing category associations
    await executeQuery(`DELETE FROM "BlogPostCategory" WHERE "postId" = $1`, [params.id])

    // Add new category associations
    if (categoryIds && categoryIds.length > 0) {
      for (const categoryId of categoryIds) {
        await executeQuery(`INSERT INTO "BlogPostCategory" ("postId", "categoryId") VALUES ($1, $2)`, [
          params.id,
          categoryId,
        ])
      }
    }

    return NextResponse.json({ message: "Post updated successfully" })
  } catch (error) {
    console.error("Error updating blog post:", error)
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Delete post (category associations will be deleted via ON DELETE CASCADE)
    const result = await executeQuery(`DELETE FROM "BlogPost" WHERE id = $1 RETURNING id`, [params.id])

    if (result.length === 0) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Post deleted successfully" })
  } catch (error) {
    console.error("Error deleting blog post:", error)
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { published } = await request.json()

    // Update post published status
    const result = await executeQuery(
      `UPDATE "BlogPost" SET published = $1, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id`,
      [published, params.id],
    )

    if (result.length === 0) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Post status updated successfully" })
  } catch (error) {
    console.error("Error updating blog post status:", error)
    return NextResponse.json({ error: "Failed to update blog post status" }, { status: 500 })
  }
}
