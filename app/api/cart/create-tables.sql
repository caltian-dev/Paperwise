-- Create Cart table to store user cart data
CREATE TABLE IF NOT EXISTS "Cart" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" TIMESTAMP NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL '30 days'),
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Create CartItem table to store individual items in a cart
CREATE TABLE IF NOT EXISTS "CartItem" (
  "id" TEXT PRIMARY KEY,
  "cartId" TEXT NOT NULL,
  "documentId" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL DEFAULT 1,
  "addedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE CASCADE,
  FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE,
  UNIQUE ("cartId", "documentId")
);

-- Create DocumentRelation table to store related documents
CREATE TABLE IF NOT EXISTS "DocumentRelation" (
  "id" TEXT PRIMARY KEY,
  "documentId" TEXT NOT NULL,
  "relatedDocumentId" TEXT NOT NULL,
  "relationStrength" INTEGER NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE,
  FOREIGN KEY ("relatedDocumentId") REFERENCES "Document"("id") ON DELETE CASCADE,
  UNIQUE ("documentId", "relatedDocumentId")
);

-- Add some initial document relations for testing
INSERT INTO "DocumentRelation" ("id", "documentId", "relatedDocumentId", "relationStrength")
SELECT 
  gen_random_uuid()::TEXT, 
  d1.id, 
  d2.id, 
  FLOOR(RANDOM() * 5) + 1
FROM 
  "Document" d1
CROSS JOIN 
  "Document" d2
WHERE 
  d1.id <> d2.id 
  AND d1.category = d2.category
  AND NOT EXISTS (
    SELECT 1 FROM "DocumentRelation" 
    WHERE "documentId" = d1.id AND "relatedDocumentId" = d2.id
  )
LIMIT 50;
