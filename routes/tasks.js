// const express = require('express');
// const db = require('../db');
// const authMiddleware = require('../middleware/authMiddleware');
// const Joi = require('joi');

// const router = express.Router();

// const taskSchema = Joi.object({
//     title: Joi.string().min(1).required(),
//     description: Joi.string().allow('').optional(),
//     status: Joi.string().valid('todo', 'in-progress', 'done').required(),
// });

// router.use(authMiddleware);

// // GET /api/tasks/projects/:projectId - Get all tasks for a project
// router.get('/projects/:projectId', async (req, res) => {
//     try {
//         const projectCheck = await db.query('SELECT user_id FROM projects WHERE id = $1', [req.params.projectId]);
//         if (projectCheck.rows.length === 0 || projectCheck.rows[0].user_id !== req.user.id) {
//             return res.status(404).json({ message: 'Project not found.' });
//         }
//         const tasks = await db.query('SELECT * FROM tasks WHERE project_id = $1 ORDER BY created_at ASC', [req.params.projectId]);
//         res.json(tasks.rows);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });

// // POST /api/tasks/projects/:projectId - Create a new task for a project
// router.post('/projects/:projectId', async (req, res) => {
//     const { title, description } = req.body;
//     try {
//         const projectCheck = await db.query('SELECT user_id FROM projects WHERE id = $1', [req.params.projectId]);
//         if (projectCheck.rows.length === 0 || projectCheck.rows[0].user_id !== req.user.id) {
//             return res.status(404).json({ message: 'Project not found.' });
//         }
//         const newTask = await db.query(
//             'INSERT INTO tasks (project_id, title, description) VALUES ($1, $2, $3) RETURNING *',
//             [req.params.projectId, title, description]
//         );
//         res.status(201).json(newTask.rows[0]);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });

// // PUT /api/tasks/:id - Update a task
// router.put('/:id', async (req, res) => {
//     const { error } = taskSchema.validate(req.body);
//     if (error) return res.status(400).json({ message: error.details[0].message });

//     const { title, description, status } = req.body;
//     try {
//         const taskCheck = await db.query(
//             'SELECT t.id FROM tasks t JOIN projects p ON t.project_id = p.id WHERE t.id = $1 AND p.user_id = $2',
//             [req.params.id, req.user.id]
//         );
//         if (taskCheck.rows.length === 0) {
//             return res.status(404).json({ message: 'Task not found.' });
//         }
//         const updatedTask = await db.query(
//             'UPDATE tasks SET title = $1, description = $2, status = $3 WHERE id = $4 RETURNING *',
//             [title, description, status, req.params.id]
//         );
//         res.json(updatedTask.rows[0]);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });

// // DELETE /api/tasks/:id - Delete a task
// router.delete('/:id', async (req, res) => {
//     try {
//         const taskCheck = await db.query(
//             'SELECT t.id FROM tasks t JOIN projects p ON t.project_id = p.id WHERE t.id = $1 AND p.user_id = $2',
//             [req.params.id, req.user.id]
//         );
//         if (taskCheck.rows.length === 0) {
//             return res.status(404).json({ message: 'Task not found.' });
//         }
//         await db.query('DELETE FROM tasks WHERE id = $1', [req.params.id]);
//         res.json({ message: 'Task deleted.' });
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });

// module.exports = router;








// // POST /api/tasks/projects/:projectId - Create a new task
// router.post('/projects/:projectId', async (req, res) => {
//     // 1. Get status from the request body, defaulting to 'todo' if not provided
//     const { title, description, status = 'todo' } = req.body;

//     // Basic validation
//     if (!title) {
//         return res.status(400).json({ message: 'Title is required.' });
//     }

//     try {
//         // Verify user owns the project
//         const projectCheck = await db.query('SELECT user_id FROM projects WHERE id = $1', [req.params.projectId]);
//         if (projectCheck.rows.length === 0 || projectCheck.rows[0].user_id !== req.user.id) {
//             return res.status(404).json({ message: 'Project not found.' });
//         }

//         // 2. Add the 'status' column and its value to the INSERT query
//         const newTask = await db.query(
//             'INSERT INTO tasks (project_id, title, description, status) VALUES ($1, $2, $3, $4) RETURNING *',
//             [req.params.projectId, title, description, status]
//         );
//         res.status(201).json(newTask.rows[0]);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });


const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const Joi = require('joi');

// This is the crucial line that defines the router
const router = express.Router();

const taskSchema = Joi.object({
    title: Joi.string().min(1).required(),
    description: Joi.string().allow('').optional(),
    status: Joi.string().valid('todo', 'in-progress', 'done').required(),
});

// Apply authentication middleware to all routes in this file
router.use(authMiddleware);

// // GET /api/tasks/projects/:projectId - Get all tasks for a project
// router.get('/projects/:projectId', async (req, res) => {
//     try {
//         const projectCheck = await db.query('SELECT user_id FROM projects WHERE id = $1', [req.params.projectId]);
//         if (projectCheck.rows.length === 0 || projectCheck.rows[0].user_id !== req.user.id) {
//             return res.status(404).json({ message: 'Project not found.' });
//         }
//         const tasks = await db.query('SELECT * FROM tasks WHERE project_id = $1 ORDER BY created_at ASC', [req.params.projectId]);
//         res.json(tasks.rows);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });

// GET /api/tasks/projects/:projectId - Get all tasks for a project, with optional status filter
router.get('/projects/:projectId', async (req, res) => {
    const { status } = req.query; // Get status from query params like ?status=todo

    try {
        // First, verify the user owns the project
        const projectCheck = await db.query('SELECT user_id FROM projects WHERE id = $1', [req.params.projectId]);
        if (projectCheck.rows.length === 0 || projectCheck.rows[0].user_id !== req.user.id) {
            return res.status(404).json({ message: 'Project not found.' });
        }

        // Build the query conditionally
        let queryText = 'SELECT * FROM tasks WHERE project_id = $1';
        const queryParams = [req.params.projectId];

        // If a valid status is provided, add it to the query
        if (status && ['todo', 'in-progress', 'done'].includes(status)) {
            queryText += ' AND status = $2';
            queryParams.push(status);
        }

        queryText += ' ORDER BY created_at ASC';

        const tasks = await db.query(queryText, queryParams);
        res.json(tasks.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// // POST /api/tasks/projects/:projectId - Create a new task
// router.post('/projects/:projectId', async (req, res) => {
//     const { title, description, status = 'todo' } = req.body;

//     if (!title) {
//         return res.status(400).json({ message: 'Title is required.' });
//     }
    
//     try {
//         const projectCheck = await db.query('SELECT user_id FROM projects WHERE id = $1', [req.params.projectId]);
//         if (projectCheck.rows.length === 0 || projectCheck.rows[0].user_id !== req.user.id) {
//             return res.status(404).json({ message: 'Project not found.' });
//         }
        
//         const newTask = await db.query(
//             'INSERT INTO tasks (project_id, title, description, status) VALUES ($1, $2, $3, $4) RETURNING *',
//             [req.params.projectId, title, description, status]
//         );
//         res.status(201).json(newTask.rows[0]);
//     } catch (err) {
//         // --- NEW --- Check for the unique violation error code '23505'
//         if (err.code === '23505') {
//             return res.status(409).json({ message: 'A task with this title already exists in this project.' });
//         }
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });


// POST /api/tasks/projects/:projectId - Create a new task
router.post('/projects/:projectId', async (req, res) => {
    const { title, description, status = 'todo' } = req.body;

    if (!title) {
        return res.status(400).json({ message: 'Title is required.' });
    }
    
    try {
        // First, verify the user owns the project
        const projectCheck = await db.query('SELECT user_id FROM projects WHERE id = $1', [req.params.projectId]);
        if (projectCheck.rows.length === 0 || projectCheck.rows[0].user_id !== req.user.id) {
            return res.status(404).json({ message: 'Project not found.' });
        }

        // --- NEW --- Proactively check for a duplicate task name, ignoring case
        const existingTask = await db.query(
            'SELECT id FROM tasks WHERE project_id = $1 AND LOWER(title) = LOWER($2)',
            [req.params.projectId, title]
        );

        if (existingTask.rows.length > 0) {
            return res.status(409).json({ message: 'A task with this title already exists in this project.' });
        }
        
        // If no duplicate is found, proceed with inserting the new task
        const newTask = await db.query(
            'INSERT INTO tasks (project_id, title, description, status) VALUES ($1, $2, $3, $4) RETURNING *',
            [req.params.projectId, title, description, status]
        );
        res.status(201).json(newTask.rows[0]);
    } catch (err) {
        // The check above now handles the duplicate error, so the catch block can be simpler.
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
// PUT /api/tasks/:id - Update a task
router.put('/:id', async (req, res) => {
    const { error } = taskSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { title, description, status } = req.body;
    try {
        const taskCheck = await db.query(
            'SELECT t.id FROM tasks t JOIN projects p ON t.project_id = p.id WHERE t.id = $1 AND p.user_id = $2',
            [req.params.id, req.user.id]
        );
        if (taskCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Task not found.' });
        }
        const updatedTask = await db.query(
            'UPDATE tasks SET title = $1, description = $2, status = $3 WHERE id = $4 RETURNING *',
            [title, description, status, req.params.id]
        );
        res.json(updatedTask.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', async (req, res) => {
    try {
        const taskCheck = await db.query(
            'SELECT t.id FROM tasks t JOIN projects p ON t.project_id = p.id WHERE t.id = $1 AND p.user_id = $2',
            [req.params.id, req.user.id]
        );
        if (taskCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Task not found.' });
        }
        await db.query('DELETE FROM tasks WHERE id = $1', [req.params.id]);
        res.json({ message: 'Task deleted.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// This line makes the router available to the rest of the app
module.exports = router;