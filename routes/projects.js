// const express = require('express');
// const db = require('../db');
// const authMiddleware = require('../middleware/authMiddleware');
// const Joi = require('joi');

// const router = express.Router();

// const projectSchema = Joi.object({
//     title: Joi.string().min(1).required(),
//     description: Joi.string().allow('').optional(),
// });

// // Apply the auth middleware to all project routes
// router.use(authMiddleware);

// // GET /api/projects - Get all projects for the logged-in user
// router.get('/', async (req, res) => {
//     try {
//         const projects = await db.query('SELECT * FROM projects WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
//         res.json(projects.rows);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });

// // POST /api/projects - Create a new project
// router.post('/', async (req, res) => {
//     const { error } = projectSchema.validate(req.body);
//     if (error) return res.status(400).json({ message: error.details[0].message });

//     const { title, description } = req.body;
//     try {
//         const newProject = await db.query(
//             'INSERT INTO projects (user_id, title, description) VALUES ($1, $2, $3) RETURNING *',
//             [req.user.id, title, description]
//         );
//         res.status(201).json(newProject.rows[0]);
//     } catch (err) {
//         if (err.code === '23505') { // Unique violation error code
//             return res.status(409).json({ message: 'A project with this title already exists.' });
//         }
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });

// // // GET /api/projects/:id - Get a single project by ID
// // router.get('/:id', async (req, res) => {
// //     try {
// //         const project = await db.query(
// //             'SELECT * FROM projects WHERE id = $1 AND user_id = $2',
// //             [req.params.id, req.user.id]
// //         );

// //         if (project.rows.length === 0) {
// //             return res.status(404).json({ message: 'Project not found' });
// //         }

// //         res.json(project.rows[0]);
// //     } catch (err) {
// //         console.error(err.message);
// //         res.status(500).send('Server Error');
// //     }
// // });

// // GET /api/projects - Get all projects for the logged-in user with pagination
// router.get('/', async (req, res) => {
//     const page = parseInt(req.query.page || '1');
//     const limit = parseInt(req.query.limit || '6'); // Show 6 projects per page
//     const offset = (page - 1) * limit;

//     try {
//         // Query for the projects on the current page
//         const projectsResult = await db.query(
//             'SELECT * FROM projects WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
//             [req.user.id, limit, offset]
//         );

//         // Query to get the total number of projects for the user
//         const totalResult = await db.query('SELECT COUNT(*) FROM projects WHERE user_id = $1', [req.user.id]);
//         const totalProjects = parseInt(totalResult.rows[0].count);
//         const totalPages = Math.ceil(totalProjects / limit);

//         // Send response in the new object format
//         res.json({
//             projects: projectsResult.rows,
//             totalPages,
//             currentPage: page,
//         });
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });


// // DELETE /api/projects/:id - Delete a project
// router.delete('/:id', async (req, res) => {
//     try {
//         const deleteOp = await db.query('DELETE FROM projects WHERE id = $1 AND user_id = $2 RETURNING *', [req.params.id, req.user.id]);
//         if (deleteOp.rows.length === 0) {
//             return res.status(404).json({ message: 'Project not found' });
//         }
//         res.json({ message: 'Project and its tasks were deleted.' });
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });

// module.exports = router;

const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const Joi = require('joi');

const router = express.Router();

const projectSchema = Joi.object({
    title: Joi.string().min(1).required(),
    description: Joi.string().allow('').optional(),
});

// Apply the auth middleware to all project routes
router.use(authMiddleware);

// GET /api/projects - Get all projects for the logged-in user with pagination
router.get('/', async (req, res) => {
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '6'); // Show 6 projects per page
    const offset = (page - 1) * limit;

    try {
        // Query for the projects on the current page
        const projectsResult = await db.query(
            'SELECT * FROM projects WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
            [req.user.id, limit, offset]
        );

        // Query to get the total number of projects for the user
        const totalResult = await db.query('SELECT COUNT(*) FROM projects WHERE user_id = $1', [req.user.id]);
        const totalProjects = parseInt(totalResult.rows[0].count);
        const totalPages = Math.ceil(totalProjects / limit);

        // Send response in the new object format
        res.json({
            projects: projectsResult.rows,
            totalPages,
            currentPage: page,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// GET /api/projects/:id - Get a single project by ID
router.get('/:id', async (req, res) => {
    try {
        const project = await db.query(
            'SELECT * FROM projects WHERE id = $1 AND user_id = $2',
            [req.params.id, req.user.id]
        );

        if (project.rows.length === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json(project.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// POST /api/projects - Create a new project
router.post('/', async (req, res) => {
    const { error } = projectSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { title, description } = req.body;
    try {
        const newProject = await db.query(
            'INSERT INTO projects (user_id, title, description) VALUES ($1, $2, $3) RETURNING *',
            [req.user.id, title, description]
        );
        res.status(201).json(newProject.rows[0]);
    } catch (err) {
        if (err.code === '23505') { // Unique violation error code
            return res.status(409).json({ message: 'A project with this title already exists.' });
        }
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// PUT /api/projects/:id - Update a project
router.put('/:id', async (req, res) => {
    const { error } = projectSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { title, description } = req.body;
    try {
        const updatedProject = await db.query(
            'UPDATE projects SET title = $1, description = $2 WHERE id = $3 AND user_id = $4 RETURNING *',
            [title, description, req.params.id, req.user.id]
        );

        if (updatedProject.rows.length === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json(updatedProject.rows[0]);
    } catch (err) {
        if (err.code === '23505') {
             return res.status(409).json({ message: 'A project with this title already exists.' });
        }
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// DELETE /api/projects/:id - Delete a project
router.delete('/:id', async (req, res) => {
    try {
        const deleteOp = await db.query('DELETE FROM projects WHERE id = $1 AND user_id = $2 RETURNING *', [req.params.id, req.user.id]);
        if (deleteOp.rows.length === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json({ message: 'Project and its tasks were deleted.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;