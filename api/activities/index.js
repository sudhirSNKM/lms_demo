const activities = require('../../backend/controllers/activities');

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const mockReq = {
            headers: req.headers
        };

        const mockRes = {
            status: (code) => ({
                json: (data) => {
                    res.status(code).json(data);
                }
            })
        };

        if (req.method === 'GET') {
            await activities.getActivities(mockReq, mockRes, () => { });
        } else {
            res.status(404).json({ success: false, error: 'Route not found' });
        }
    } catch (error) {
        console.error('Activities error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
