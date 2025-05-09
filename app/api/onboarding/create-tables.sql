-- Create onboarding_emails table if it doesn't exist
CREATE TABLE IF NOT EXISTS onboarding_emails (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  email_type VARCHAR(50) NOT NULL,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'sent',
  UNIQUE(user_id, email_type)
);

-- Create onboarding_sequences table if it doesn't exist
CREATE TABLE IF NOT EXISTS onboarding_sequences (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed BOOLEAN DEFAULT FALSE,
  current_step INT DEFAULT 0,
  last_email_sent_at TIMESTAMP DEFAULT NULL
);
