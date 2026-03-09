CREATE TABLE lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    title TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO lists (id, user_id, title) VALUES
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Work'),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Personal');
