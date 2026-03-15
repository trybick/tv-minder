INSERT INTO users (email, password_hash) VALUES
    ('alice@example.com', '$2a$12$mockhashalicexxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'),
    ('bob@example.com',   '$2a$12$mockhashbobxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
ON CONFLICT (email) DO NOTHING;
