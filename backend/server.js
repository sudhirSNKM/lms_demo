const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

// Load env vars
dotenv.config();

// Route files
const auth = require('./routes/auth');
const leads = require('./routes/leads');
const activities = require('./routes/activities');

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/auth', auth);
app.use('/api/leads', leads);
app.use('/api/activities', activities);

const connectDB = async () => {
    // Check if we have a real MongoDB URI
    if (process.env.MONGODB_URI) {
        try {
            console.log('Attempting to connect to Cloud MongoDB...');
            const conn = await mongoose.connect(process.env.MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            console.log(`MongoDB Cloud Connected: ${conn.connection.host}`);
            return;
        } catch (err) {
            console.error(`Cloud MongoDB Error: ${err.message}. Falling back...`);
        }
    }

    // Fallback logic could be here, but we are restoring Mongoose.
    // So we must exit if no DB.
    console.error('No working MongoDB connection found. Please check .env MONGODB_URI');
    process.exit(1); // Exit if no MongoDB connection
}

connectDB();

const PORT = 5000;

const server = app.listen(
    PORT,
    console.log(`Server running on port ${PORT} (Using JSON File DB)`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});
