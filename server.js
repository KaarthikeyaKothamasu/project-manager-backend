const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- NEW --- CORS Configuration
// This tells our server to only accept requests from our deployed frontend.
const allowedOrigins = [
    'http://localhost:5173', // For local development
    'http://localhost:8080', // For local Docker development
    'https://project-manager-frontend-opal.vercel.app/login' // **REPLACE THIS with your actual Vercel URL**
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
};

app.use(cors(corsOptions)); // Use the new options

// Allow the server to accept and parse JSON in request bodies
app.use(express.json());

// --- API Routes ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));

// --- Server Initialization ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
