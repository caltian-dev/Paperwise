-- Check if Bundle table exists, create if not
CREATE TABLE IF NOT EXISTS "Bundle" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "price" FLOAT NOT NULL,
  "category" TEXT NOT NULL,
  "popular" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Check if BundleDocument table exists, create if not
CREATE TABLE IF NOT EXISTS "BundleDocument" (
  "bundleId" TEXT NOT NULL,
  "documentId" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("bundleId", "documentId"),
  FOREIGN KEY ("bundleId") REFERENCES "Bundle" ("id") ON DELETE CASCADE,
  FOREIGN KEY ("documentId") REFERENCES "Document" ("id") ON DELETE CASCADE
);
