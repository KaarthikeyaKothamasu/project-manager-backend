-- Drop tables if they exist to start fresh
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS users;

-- Create an ENUM type for task status
CREATE TYPE task_status AS ENUM ('todo', 'in-progress', 'done');

-- Create the Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);

-- Create the Projects table
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create the Tasks table
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status task_status NOT NULL DEFAULT 'todo',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for performance
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);

-- Add a unique constraint to prevent duplicate project titles for the same user
ALTER TABLE projects ADD CONSTRAINT unique_user_project_title UNIQUE (user_id, title);

-- Add a unique constraint to prevent duplicate task titles within the same project
ALTER TABLE tasks ADD CONSTRAINT unique_project_task_title UNIQUE (project_id, title);

-- Notify that the schema has been created
\echo 'Database schema created successfully!'