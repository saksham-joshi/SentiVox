CREATE TABLE IF NOT EXISTS Users (
  email varchar(256) PRIMARY KEY,
  full_name varchar(32) NOT NULL,
  api_key varchar(256) NOT NULL UNIQUE,
  join_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,   -- stores in UTC only
  api_key_update_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, -- api keys can be rotated only once every 24 hours

  CONSTRAINT valid_email CHECK (email ~ '^[A-Za-z0-9._%+-]+@(gmail\.com|outlook\.com|yahoo\.com|hotmail\.com)$'),
  CONSTRAINT valid_full_name CHECK (length(full_name) >= 3 AND length(full_name) <= 31),
  CONSTRAINT valid_api_key CHECK (length(api_key) = 128)
);

CREATE INDEX email_index ON Users(email);
CREATE INDEX api_key_index ON Users(api_key);

ALTER TABLE Users ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON SCHEMA public FROM PUBLIC;

-- CREATE ROLE site_role WITH
--   LOGIN
--   ENCRYPTED PASSWORD '[PASSWORD]';

GRANT USAGE ON SCHEMA public TO site_role;

GRANT SELECT, INSERT, UPDATE ON Users TO site_role;

CREATE POLICY "Site role can select from Users" ON Users 
  FOR SELECT 
  USING (current_user = 'site_role');

CREATE POLICY "Site role can insert in Users" ON Users
  FOR INSERT
  WITH CHECK (current_user = 'site_role');

CREATE POLICY "Site role can update Users" ON Users 
  FOR UPDATE
  USING (current_user = 'site_role')
  WITH CHECK (current_user = 'site_role');

CREATE POLICY "No hard deletes" ON Users
  FOR DELETE
  USING (FALSE);