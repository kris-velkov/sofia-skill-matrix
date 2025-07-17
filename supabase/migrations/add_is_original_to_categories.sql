-- Add is_original column to categories table
ALTER TABLE categories ADD COLUMN IF NOT EXISTS is_original BOOLEAN DEFAULT FALSE;

-- Mark existing categories as original (you can adjust this based on your needs)
-- For example, if you want to mark specific categories as original:
-- UPDATE categories SET is_original = TRUE WHERE name IN ('Generic', 'Javascript', 'Data stores');

-- Or if you want to mark all existing categories as original:
-- UPDATE categories SET is_original = TRUE;

-- Comment: This migration adds the is_original column to the categories table.
-- Categories marked as original (is_original = TRUE) cannot be deleted through the UI.
-- New categories created through the UI will automatically be marked as custom (is_original = FALSE).