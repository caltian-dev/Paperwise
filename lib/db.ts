import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

// Create a SQL client with the database URL from environment variables
const sql = neon(process.env.DATABASE_URL!)

// Create a drizzle client for more structured queries
export const db = drizzle(sql)

// Helper function to execute raw SQL queries
export async function executeQuery(queryText: string, params: any[] = []) {
  // Use the sql.query method for parameterized queries
  return sql.query(queryText, params)
}

// Document-related queries
export const documentQueries = {
  // Get all documents
  getAll: async () => {
    return sql`SELECT * FROM "Document" ORDER BY "createdAt" DESC`
  },

  // Get a document by ID
  getById: async (id: string) => {
    const results = await sql`SELECT * FROM "Document" WHERE "id" = ${id}`
    return results[0] || null
  },

  // Get multiple documents by IDs
  getByIds: async (ids: string[]) => {
    if (!ids.length) return []
    return sql`SELECT * FROM "Document" WHERE "id" IN ${sql(ids)}`
  },

  // Get related documents
  getRelated: async (documentId: string, limit = 4) => {
    return sql`
      SELECT d.* FROM "Document" d
      JOIN "DocumentRelation" dr ON d."id" = dr."relatedDocumentId"
      WHERE dr."documentId" = ${documentId}
      ORDER BY dr."relationStrength" DESC
      LIMIT ${limit}
    `
  },

  // Create a new document
  create: async (document: {
    id: string
    name: string
    description: string
    price: number
    blobUrl: string
    formats: string[]
    category: string
  }) => {
    const { id, name, description, price, blobUrl, formats, category } = document
    return sql`
      INSERT INTO "Document" ("id", "name", "description", "price", "blobUrl", "formats", "category") 
      VALUES (${id}, ${name}, ${description}, ${price}, ${blobUrl}, ${formats}, ${category}) 
      RETURNING *
    `
  },

  // Delete a document
  delete: async (id: string) => {
    return sql`DELETE FROM "Document" WHERE "id" = ${id}`
  },
}

// Purchase-related queries
export const purchaseQueries = {
  // Get all purchases for a user
  getByUserId: async (userId: string) => {
    return sql`
      SELECT p.*, d."name", d."description", d."formats", d."category" 
      FROM "Purchase" p
      JOIN "Document" d ON p."documentId" = d."id"
      WHERE p."userId" = ${userId}
      ORDER BY p."createdAt" DESC
    `
  },

  // Get a purchase by ID
  getById: async (id: string) => {
    const results = await sql`
      SELECT p.*, d."name", d."description", d."formats", d."category" 
      FROM "Purchase" p
      JOIN "Document" d ON p."documentId" = d."id"
      WHERE p."id" = ${id}
    `
    return results[0] || null
  },

  // Create a new purchase
  create: async (purchase: {
    id: string
    userId: string
    documentId: string
    amount: number
    status: string
    stripeSessionId?: string
    expiresAt: Date
  }) => {
    const { id, userId, documentId, amount, status, stripeSessionId, expiresAt } = purchase
    return sql`
      INSERT INTO "Purchase" ("id", "userId", "documentId", "amount", "status", "stripeSessionId", "expiresAt") 
      VALUES (${id}, ${userId}, ${documentId}, ${amount}, ${status}, ${stripeSessionId}, ${expiresAt}) 
      RETURNING *
    `
  },

  // Update download count
  incrementDownloadCount: async (id: string) => {
    return sql`UPDATE "Purchase" SET "downloadCount" = "downloadCount" + 1 WHERE "id" = ${id} RETURNING *`
  },
}

// User-related queries
export const userQueries = {
  // Get a user by email
  getByEmail: async (email: string) => {
    const results = await sql`SELECT * FROM "User" WHERE "email" = ${email}`
    return results[0] || null
  },

  // Get a user by ID
  getById: async (id: string) => {
    const results = await sql`SELECT * FROM "User" WHERE "id" = ${id}`
    return results[0] || null
  },

  // Create a new user
  create: async (user: {
    id: string
    name: string
    email: string
    password: string
    role?: string
  }) => {
    const { id, name, email, password, role = "user" } = user
    return sql`
      INSERT INTO "User" ("id", "name", "email", "password", "role") 
      VALUES (${id}, ${name}, ${email}, ${password}, ${role}) 
      RETURNING *
    `
  },
}

// Cart-related queries
export const cartQueries = {
  // Get or create a cart for a user
  getOrCreate: async (userId: string) => {
    // Check if user already has a cart
    const existingCart = await sql`
      SELECT * FROM "Cart" 
      WHERE "userId" = ${userId} 
      AND "expiresAt" > CURRENT_TIMESTAMP
    `

    if (existingCart.length > 0) {
      // Update the expiration date
      await sql`
        UPDATE "Cart" 
        SET "expiresAt" = (CURRENT_TIMESTAMP + INTERVAL '30 days'),
            "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = ${existingCart[0].id}
      `
      return existingCart[0]
    }

    // Create a new cart
    const cartId = crypto.randomUUID()
    const newCart = await sql`
      INSERT INTO "Cart" ("id", "userId", "expiresAt") 
      VALUES (${cartId}, ${userId}, (CURRENT_TIMESTAMP + INTERVAL '30 days')) 
      RETURNING *
    `

    return newCart[0]
  },

  // Get cart items for a cart
  getItems: async (cartId: string) => {
    return sql`
      SELECT ci.*, d."name", d."price", d."category" 
      FROM "CartItem" ci
      JOIN "Document" d ON ci."documentId" = d."id"
      WHERE ci."cartId" = ${cartId}
      ORDER BY ci."addedAt" DESC
    `
  },

  // Add item to cart
  addItem: async (cartId: string, documentId: string, quantity = 1) => {
    try {
      // Try to insert a new item
      return await sql`
        INSERT INTO "CartItem" ("id", "cartId", "documentId", "quantity") 
        VALUES (${crypto.randomUUID()}, ${cartId}, ${documentId}, ${quantity}) 
        RETURNING *
      `
    } catch (error) {
      // If the item already exists, update the quantity
      return await sql`
        UPDATE "CartItem" 
        SET "quantity" = "quantity" + ${quantity},
            "addedAt" = CURRENT_TIMESTAMP
        WHERE "cartId" = ${cartId} AND "documentId" = ${documentId}
        RETURNING *
      `
    }
  },

  // Update item quantity
  updateItemQuantity: async (cartId: string, documentId: string, quantity: number) => {
    if (quantity <= 0) {
      // Remove the item if quantity is 0 or negative
      return await sql`
        DELETE FROM "CartItem" 
        WHERE "cartId" = ${cartId} AND "documentId" = ${documentId}
      `
    }

    return await sql`
      UPDATE "CartItem" 
      SET "quantity" = ${quantity}
      WHERE "cartId" = ${cartId} AND "documentId" = ${documentId}
      RETURNING *
    `
  },

  // Remove item from cart
  removeItem: async (cartId: string, documentId: string) => {
    return await sql`
      DELETE FROM "CartItem" 
      WHERE "cartId" = ${cartId} AND "documentId" = ${documentId}
    `
  },

  // Clear cart
  clearCart: async (cartId: string) => {
    return await sql`DELETE FROM "CartItem" WHERE "cartId" = ${cartId}`
  },

  // Delete expired carts
  deleteExpired: async () => {
    return await sql`DELETE FROM "Cart" WHERE "expiresAt" < CURRENT_TIMESTAMP`
  },

  // Get cart by user ID
  getByUserId: async (userId: string) => {
    const results = await sql`
      SELECT * FROM "Cart" 
      WHERE "userId" = ${userId} 
      AND "expiresAt" > CURRENT_TIMESTAMP
    `
    return results[0] || null
  },
}
