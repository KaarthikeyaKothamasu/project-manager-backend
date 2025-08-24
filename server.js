const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- Middleware ---
// Enable Cross-Origin Resource Sharing for our frontend
app.use(cors());
// Allow the server to accept and parse JSON in request bodies
app.use(express.json());

// --- API Routes ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));

// --- Server Initialization ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));