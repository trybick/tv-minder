DO $$
BEGIN
    IF (
        SELECT data_type
        FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'password_hash'
    ) = 'text' THEN
        ALTER TABLE users ALTER COLUMN password_hash TYPE BYTEA USING decode(password_hash, 'base64');
    END IF;
END$$;
