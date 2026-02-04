// Import activity store from leads controller
let activityStore = [];

// @desc    Get all activities
// @route   GET /api/activities
// @access  Private
exports.getActivities = async (req, res, next) => {
    try {
        // Get activities from leads controller if available
        const leadsController = require('./leads');
        if (leadsController.activityStore) {
            activityStore = leadsController.activityStore;
        }

        // Sort by most recent first
        const sortedActivities = activityStore.sort((a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
        );

        res.status(200).json({
            success: true,
            count: sortedActivities.length,
            data: sortedActivities.slice(0, 50) // Limit to 50 most recent
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// Helper function to log activities
exports.logActivity = async (action, description, user) => {
    try {
        const activity = {
            _id: 'activity_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            action,
            description,
            user,
            createdAt: new Date()
        };

        activityStore.push(activity);
        return activity;
    } catch (err) {
        console.error('Error logging activity:', err);
    }
};
