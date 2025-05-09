-- Create email_templates table if it doesn't exist
CREATE TABLE IF NOT EXISTS "email_templates" (
  "id" VARCHAR(50) PRIMARY KEY,
  "name" VARCHAR(100) NOT NULL,
  "subject" VARCHAR(200) NOT NULL,
  "html_content" TEXT NOT NULL,
  "description" TEXT,
  "last_updated" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default templates if they don't exist
INSERT INTO "email_templates" ("id", "name", "subject", "html_content", "description")
VALUES 
  ('welcome', 'Welcome Email', 'Welcome to Paperwise!', '', 'Sent when a user first signs up')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "email_templates" ("id", "name", "subject", "html_content", "description")
VALUES 
  ('featured_templates', 'Featured Templates', 'Discover Our Most Popular Templates', '', 'Highlights popular document templates')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "email_templates" ("id", "name", "subject", "html_content", "description")
VALUES 
  ('bundle_value', 'Bundle Value', 'Save with Our Document Bundles', '', 'Promotes document bundles and their savings')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "email_templates" ("id", "name", "subject", "html_content", "description")
VALUES 
  ('legal_tips', 'Legal Tips', 'Legal Tips for Your Business', '', 'Provides valuable legal advice for business owners')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "email_templates" ("id", "name", "subject", "html_content", "description")
VALUES 
  ('feedback', 'Feedback Request', 'How\'s Your Experience with Paperwise?', '', 'Asks for user feedback')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "email_templates" ("id", "name", "subject", "html_content", "description")
VALUES 
  ('purchase_confirmation', 'Purchase Confirmation', 'Thank You for Your Purchase!', '', 'Sent after a successful purchase')
ON CONFLICT (id) DO NOTHING;
