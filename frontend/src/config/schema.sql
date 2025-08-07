-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create wellness_entries table
CREATE TABLE IF NOT EXISTS wellness_entries (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    entry_date DATE NOT NULL,
    mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 10),
    energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
    sleep_hours DECIMAL(3,1) CHECK (sleep_hours >= 0 AND sleep_hours <= 24),
    sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 10),
    stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 10),
    water_intake INTEGER DEFAULT 0,
    exercise_minutes INTEGER DEFAULT 0,
    notes TEXT,
    ai_insights TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    sender VARCHAR(10) CHECK (sender IN ('user', 'bot')),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_wellness_entries_user_id ON wellness_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_wellness_entries_date ON wellness_entries(entry_date);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_timestamp ON chat_messages(timestamp);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wellness_entries_updated_at BEFORE UPDATE ON wellness_entries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert demo user if not exists
INSERT INTO users (email, first_name, last_name, password_hash) 
VALUES ('demo@wellnest.com', 'Demo', 'User', '$2b$10$demo.hash.for.testing')
ON CONFLICT (email) DO NOTHING;

-- Insert some sample wellness entries for demo user
INSERT INTO wellness_entries (user_id, entry_date, mood_rating, energy_level, sleep_hours, sleep_quality, stress_level, water_intake, exercise_minutes, notes, ai_insights)
SELECT 
    u.id,
    CURRENT_DATE - INTERVAL '1 day' * generate_series(0, 6),
    6 + floor(random() * 4)::int,
    5 + floor(random() * 4)::int,
    6.5 + random() * 3,
    5 + floor(random() * 4)::int,
    3 + floor(random() * 4)::int,
    6 + floor(random() * 4)::int,
    20 + floor(random() * 40)::int,
    'Sample entry for testing',
    'Great balance today! Your mood and energy levels are well-aligned with your sleep quality.'
FROM users u 
WHERE u.email = 'demo@wellnest.com'
ON CONFLICT DO NOTHING; 