CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO users (id, email)
VALUES ('00000000-0000-0000-0000-000000000001', 'dev@test.com');

