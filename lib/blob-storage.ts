import { put, del } from "@vercel/blob"

export async function uploadDocument(file: Buffer | Blob, fileName: string, contentType: string) {
  const blob = await put(fileName, file, {
    access: "public", // Changed from "private" to "public"
    contentType,
  })

  return blob
}

export async function getDocumentUrl(blobUrl: string, expiresInSeconds = 3600) {
  // For public blobs, we can just return the URL directly
  return blobUrl
}

export async function deleteDocument(blobUrl: string) {
  await del(blobUrl)
}
