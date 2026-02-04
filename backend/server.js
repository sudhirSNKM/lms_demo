const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// In-memory storage
let leads = [];
let activities = [];

// Helper to generate ID
const generateId = () => 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

// ============ AUTH ROUTES ============
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Please provide email and password' });
    }

    // Accept any credentials
    const token = 'demo-token-' + Buffer.from(email).toString('base64');
    const user = {
        id: generateId(),
        name: email.split('@')[0] || 'Demo User',
        email: email,
        role: 'admin'
    };

    res.json({ success: true, token, user });
});

// ============ LEADS ROUTES ============
app.get('/api/leads', (req, res) => {
    res.json({ success: true, count: leads.length, data: leads });
});

app.get('/api/leads/:id', (req, res) => {
    const lead = leads.find(l => l._id === req.params.id);
    if (!lead) {
        return res.status(404).json({ success: false, error: 'Lead not found' });
    }
    res.json({ success: true, data: lead });
});

app.post('/api/leads', (req, res) => {
    const lead = {
        _id: generateId(),
        ...req.body,
        createdAt: new Date()
    };
    leads.push(lead);

    activities.push({
        _id: generateId(),
        action: 'Create Lead',
        description: `Created new lead: ${lead.name}`,
        user: 'Demo User',
        createdAt: new Date()
    });

    res.status(201).json({ success: true, data: lead });
});

app.put('/api/leads/:id', (req, res) => {
    const index = leads.findIndex(l => l._id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ success: false, error: 'Lead not found' });
    }

    leads[index] = { ...leads[index], ...req.body };

    activities.push({
        _id: generateId(),
        action: 'Update Lead',
        description: `Updated lead: ${leads[index].name}`,
        user: 'Demo User',
        createdAt: new Date()
    });

    res.json({ success: true, data: leads[index] });
});

app.delete('/api/leads/:id', (req, res) => {
    const index = leads.findIndex(l => l._id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ success: false, error: 'Lead not found' });
    }

    const deletedLead = leads[index];
    leads.splice(index, 1);

    activities.push({
        _id: generateId(),
        action: 'Delete Lead',
        description: `Deleted lead: ${deletedLead.name}`,
        user: 'Demo User',
        createdAt: new Date()
    });

    res.json({ success: true, data: {} });
});

// ============ ACTIVITIES ROUTES ============
app.get('/api/activities', (req, res) => {
    const sortedActivities = activities.sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    );
    res.json({ success: true, count: sortedActivities.length, data: sortedActivities.slice(0, 50) });
});

// ============ AUTH MIDDLEWARE ROUTES ============
app.put('/api/auth/updatedetails', (req, res) => {
    const { name, email } = req.body;
    res.json({ success: true, data: { name, email, role: 'admin' } });
});

app.put('/api/auth/updatepassword', (req, res) => {
    res.json({ success: true, message: 'Password updated' });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📊 Frontend: http://localhost:3000`);
});
