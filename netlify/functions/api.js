const serverless = require('serverless-http');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

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

// Connect to MongoDB
let cachedDb = null;

const connectDB = async () => {
    if (cachedDb) {
        return cachedDb;
    }

    if (process.env.MONGODB_URI) {
        try {
            console.log('Attempting to connect to Cloud MongoDB...');
            const conn = await mongoose.connect(process.env.MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            console.log(`MongoDB Cloud Connected: ${conn.connection.host}`);
            cachedDb = conn;
            return conn;
        } catch (err) {
            console.error(`Cloud MongoDB Error: ${err.message}`);
            throw err;
        }
    } else {
        throw new Error('No MONGODB_URI found in environment variables');
    }
};

// Netlify Function Handler
exports.handler = async (event, context) => {
    // Ensure DB connection
    await connectDB();

    // Important: Tell AWS Lambda to reuse connections
    context.callbackWaitsForEmptyEventLoop = false;

    // Use serverless-http to handle Express app
    const handler = serverless(app);
    return handler(event, context);
};
