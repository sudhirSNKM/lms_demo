// In-memory storage for demo mode
let leadsStore = [];
let activityStore = [];

// Helper to generate ID
const generateId = () => {
    return 'lead_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private
exports.getLeads = async (req, res, next) => {
    try {
        res.status(200).json({ success: true, count: leadsStore.length, data: leadsStore });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get single lead
// @route   GET /api/leads/:id
// @access  Private
exports.getLead = async (req, res, next) => {
    try {
        const lead = leadsStore.find(l => l._id === req.params.id);

        if (!lead) {
            return res.status(404).json({ success: false, error: 'Lead not found' });
        }

        res.status(200).json({ success: true, data: lead });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Create new lead
// @route   POST /api/leads
// @access  Private
exports.createLead = async (req, res, next) => {
    try {
        const lead = {
            _id: generateId(),
            ...req.body,
            createdAt: new Date()
        };

        leadsStore.push(lead);

        // Log activity
        activityStore.push({
            _id: generateId(),
            action: 'Create Lead',
            description: `Created new lead: ${lead.name}`,
            user: req.user.name,
            createdAt: new Date()
        });

        res.status(201).json({ success: true, data: lead });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Update lead
// @route   PUT /api/leads/:id
// @access  Private
exports.updateLead = async (req, res, next) => {
    try {
        const index = leadsStore.findIndex(l => l._id === req.params.id);

        if (index === -1) {
            return res.status(404).json({ success: false, error: 'Lead not found' });
        }

        leadsStore[index] = {
            ...leadsStore[index],
            ...req.body
        };

        // Log activity
        activityStore.push({
            _id: generateId(),
            action: 'Update Lead',
            description: `Updated lead: ${leadsStore[index].name}`,
            user: req.user.name,
            createdAt: new Date()
        });

        res.status(200).json({ success: true, data: leadsStore[index] });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private
exports.deleteLead = async (req, res, next) => {
    try {
        const index = leadsStore.findIndex(l => l._id === req.params.id);

        if (index === -1) {
            return res.status(404).json({ success: false, error: 'Lead not found' });
        }

        const deletedLead = leadsStore[index];
        leadsStore.splice(index, 1);

        // Log activity
        activityStore.push({
            _id: generateId(),
            action: 'Delete Lead',
            description: `Deleted lead: ${deletedLead.name}`,
            user: req.user.name,
            createdAt: new Date()
        });

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// Export stores for activities controller
exports.activityStore = activityStore;
