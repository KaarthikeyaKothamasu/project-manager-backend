-- Seed data for the Users table
-- Passwords are 'password123' hashed with bcrypt.
-- In a real app, you would hash this programmatically.
INSERT INTO users (name, email, password_hash) VALUES
('Alice Johnson', 'alice@example.com', '$2b$10$E9p.IZ3D9.V/v9eH.k8cIuNOBLOFpG3.L5Gje4GgG9A/w0f.BFzU.'),
('Bob Williams', 'bob@example.com', '$2b$10$4.sV5G2XgfN5mC1.a6jCveUeN0wY.i2sgg1k6nZ5mI6z8B7K.wZ2G');

-- Seed data for the Projects table
INSERT INTO projects (user_id, title, description) VALUES
(1, 'Personal Website Redesign', 'Complete overhaul of my personal portfolio website.'),
(1, 'Mobile App Development', 'Create a new task management mobile application.'),
(2, 'Data Analysis Dashboard', 'Build a dashboard for visualizing company metrics.');

-- Seed data for the Tasks table
-- Tasks for Project 1 (Personal Website Redesign)
INSERT INTO tasks (project_id, title, description, status) VALUES
(1, 'Design UI Mockups', 'Create mockups in Figma.', 'done'),
(1, 'Develop Frontend', 'Code the UI using React.', 'in-progress'),
(1, 'Setup Backend API', 'Build the supporting API.', 'todo');

-- Tasks for Project 2 (Mobile App Development)
INSERT INTO tasks (project_id, title, description, status) VALUES
(2, 'Plan Features', 'Outline the core features of the app.', 'done'),
(2, 'Setup Authentication', 'Implement user login and registration.', 'in-progress');

-- Tasks for Project 3 (Data Analysis Dashboard)
INSERT INTO tasks (project_id, title, description, status) VALUES
(3, 'Connect to Data Source', 'Establish a connection to the PostgreSQL database.', 'todo'),
(3, 'Create Charts', 'Build interactive charts with D3.js.', 'todo');

\echo 'Database seeded successfully!'