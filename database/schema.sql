-- database/schema.sql
USE defaultdb;

-- Drop the table if it already exists to start clean
DROP TABLE IF EXISTS tasks;

-- Create the tasks table with title, description, status, and completed columns
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Seed initial test tasks
INSERT INTO tasks (title, description, status, completed)
VALUES 
    ('Set up the Node.js project', 'Initialize git and package.json', 'pending', FALSE),
    ('Install Express and mysql2', 'Install required backend dependencies', 'completed', TRUE),
    ('Create the database schema', 'Set up tasks table in Aiven MySQL', 'completed', TRUE),
    ('Build the GET /tasks route', 'Fetch tasks from cloud database', 'pending', FALSE),
    ('Build the POST /tasks route', 'Create new task endpoint', 'pending', FALSE),
    ('Test all endpoints in Postman', 'Verify CRUD operations', 'pending', FALSE);

-- Confirm execution and output seeded tasks
SELECT 'Setup complete' AS status;
SELECT * FROM tasks;
