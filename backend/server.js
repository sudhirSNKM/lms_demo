const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

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
