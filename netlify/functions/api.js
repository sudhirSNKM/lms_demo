const serverless = require('serverless-http');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Load env vars
dotenv.config();

// Route files
const auth = require('../../backend/routes/auth');
const leads = require('../../backend/routes/leads');
const activities = require('../../backend/routes/activities');

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/auth', auth);
app.use('/api/leads', leads);
app.use('/api/activities', activities);

// Netlify Function Handler
exports.handler = async (event, context) => {
    // Important: Tell AWS Lambda to reuse connections
    context.callbackWaitsForEmptyEventLoop = false;

    try {
        // Use serverless-http to handle Express app
        const handler = serverless(app);
        return await handler(event, context);
    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                error: 'Internal server error',
                message: error.message
            })
        };
    }
};
