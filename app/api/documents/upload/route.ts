import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { documentQueries } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: Request) {
  try {
    // Parse the form data
    const formData = await request.formData()
    const file = formData.get("file") as File
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const price = Number.parseFloat(formData.get("price") as string)
    const category = formData.get("category") as string
    const format = formData.get("format") as string

    // Validate required fields
    if (!file || !name || !description || isNaN(price) || !category || !format) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log("Uploading document:", { name, format, size: file.size })

    // Generate a unique filename
    const fileExtension = file.name.split(".").pop()
    const uniqueFilename = `documents/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`

    try {
      // Upload to Vercel Blob - using public access as required
      const fileBuffer = Buffer.from(await file.arrayBuffer())
      const blob = await put(uniqueFilename, fileBuffer, {
        access: "public", // Changed from "private" to "public"
        contentType: file.type,
      })

      console.log("File uploaded to Blob:", blob.url)

      // Create document record in database
      const documentId = uuidv4()
      const document = await documentQueries.create({
        id: documentId,
        name,
        description,
        price,
        blobUrl: blob.url,
        formats: [format],
        category,
      })

      return NextResponse.json(document[0])
    } catch (uploadError: any) {
      console.error("Error during file upload:", uploadError)
      return NextResponse.json({ error: `File upload failed: ${uploadError.message}` }, { status: 500 })
    }
  } catch (error: any) {
    console.error("Error uploading document:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
