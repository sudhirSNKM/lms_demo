const leads = require('../../backend/controllers/leads');

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        // Extract lead ID from URL
        const pathParts = req.url.split('/');
        const leadId = pathParts[pathParts.length - 1];

        // Extract token and create mock user
        const token = req.headers.authorization?.split(' ')[1];
        let mockUser = { id: 'demo-user', name: 'Demo User', email: 'demo@test.com', role: 'admin' };

        if (token && token.startsWith('demo-token-')) {
            const emailBase64 = token.replace('demo-token-', '');
            const email = Buffer.from(emailBase64, 'base64').toString('utf-8');
            mockUser = {
                id: 'demo-user',
                email: email,
                name: email.split('@')[0],
                role: 'admin'
            };
        }

        const mockReq = {
            body: req.body,
            headers: req.headers,
            params: { id: leadId },
            user: mockUser,
            method: req.method
        };

        const mockRes = {
            status: (code) => ({
                json: (data) => {
                    res.status(code).json(data);
                }
            })
        };

        // Route to appropriate controller method
        if (req.method === 'GET') {
            await leads.getLead(mockReq, mockRes, () => { });
        } else if (req.method === 'PUT') {
            await leads.updateLead(mockReq, mockRes, () => { });
        } else if (req.method === 'DELETE') {
            await leads.deleteLead(mockReq, mockRes, () => { });
        } else {
            res.status(404).json({ success: false, error: 'Route not found' });
        }
    } catch (error) {
        console.error('Lead error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
