const Activity = require('../models/Activity');

// @desc    Get recent activities
// @route   GET /api/activities
// @access  Private
exports.getActivities = async (req, res, next) => {
    try {
        const activities = await Activity.find();
        // Sort by date desc manually since it's JSON array
        activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        res.status(200).json({ success: true, count: activities.length, data: activities.slice(0, 20) });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// Helper to log activity
exports.logActivity = async (action, description, user) => {
    try {
        await Activity.create({
            action,
            description,
            user: user,
            createdAt: new Date().toISOString()
        });
    } catch (err) {
        console.error('Activity Log Error:', err);
    }
};
