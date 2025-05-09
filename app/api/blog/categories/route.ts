import { executeQuery } from "@/lib/db"
import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

export async function GET() {
  try {
    const categories = await executeQuery(`SELECT * FROM "BlogCategory" ORDER BY name`)
    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching blog categories:", error)
    return NextResponse.json({ error: "Failed to fetch blog categories" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, slug } = await request.json()

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json({ message: "Name and slug are required" }, { status: 400 })
    }

    // Check if slug is already in use
    const existingCategory = await executeQuery(`SELECT id FROM "BlogCategory" WHERE slug = $1`, [slug])

    if (existingCategory.length > 0) {
      return NextResponse.json({ message: "A category with this slug already exists" }, { status: 400 })
    }

    // Create new category
    const categoryId = uuidv4()
    await executeQuery(`INSERT INTO "BlogCategory" (id, name, slug) VALUES ($1, $2, $3)`, [categoryId, name, slug])

    return NextResponse.json({ id: categoryId, message: "Category created successfully" }, { status: 201 })
  } catch (error) {
    console.error("Error creating blog category:", error)
    return NextResponse.json({ error: "Failed to create blog category" }, { status: 500 })
  }
}
