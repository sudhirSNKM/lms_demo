// MOCK API ADAPTER for Frontend-Only Demo
// This replaces the real backend with localStorage simulation

const MOCK_DELAY = 300; // ms

async function fetchAPI(endpoint, method = 'GET', body = null) {
    console.log(`[MOCK API] ${method} ${endpoint}`, body);

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                let response = { success: true, data: null };

                // === AUTH ===
                if (endpoint.includes('/auth/login') || endpoint.includes('/auth/register')) {
                    // Accept any login
                    response.data = {
                        token: 'mock-token-' + Date.now(),
                        user: { name: 'Demo User', email: body?.email || 'admin@ace.com', role: 'admin' }
                    };
                }

                // === LEADS ===
                else if (endpoint === '/leads') {
                    if (method === 'GET') {
                        const leads = getLeads();
                        response.data = leads;
                    } else if (method === 'POST') {
                        const newLead = { ...body, _id: 'lead-' + Date.now(), createdAt: new Date() };
                        const leads = getLeads();
                        leads.unshift(newLead);
                        saveLeads(leads);
                        response.data = newLead;
                    }
                }
                else if (endpoint.startsWith('/leads/')) {
                    const id = endpoint.split('/')[2];
                    const leads = getLeads();

                    if (method === 'DELETE') {
                        const filtered = leads.filter(l => l._id !== id);
                        saveLeads(filtered);
                        response.data = { message: 'Deleted' };
                    } else if (method === 'PUT') {
                        const index = leads.findIndex(l => l._id === id);
                        if (index !== -1) {
                            leads[index] = { ...leads[index], ...body };
                            saveLeads(leads);
                            response.data = leads[index];
                        }
                    } else if (method === 'GET') {
                        response.data = leads.find(l => l._id === id);
                    }
                }

                // === ACTIVITIES ===
                else if (endpoint === '/activities') {
                    // Return mock activities
                    response.data = [
                        { action: 'Lead Created', description: 'New lead "John Smith" added', createdAt: new Date(), user: 'Demo User' },
                        { action: 'Email Sent', description: 'AI Follow-up sent to "TechCorp"', createdAt: new Date(Date.now() - 3600000), user: 'System' },
                        { action: 'Status Update', description: 'Moved "Design Studio" to Qualified', createdAt: new Date(Date.now() - 86400000), user: 'Demo User' }
                    ];
                }

                // === PROFILE ===
                else if (endpoint.includes('/auth/update')) {
                    response.data = body; // Echo back
                }

                resolve(response);
            } catch (err) {
                console.error('Mock API Error', err);
                reject(err);
            }
        }, MOCK_DELAY);
    });
}

// Helper to get leads from storage or init default
function getLeads() {
    const stored = localStorage.getItem('ace_leads');
    if (stored) return JSON.parse(stored);

    // Default Mock Data
    const defaults = [
        { _id: '1', name: 'Sarah Miller', company: 'TechFlow Inc', email: 'sarah@techflow.com', phone: '555-0123', status: 'New', priority: 'Hot' },
        { _id: '2', name: 'James Wilson', company: 'Design & Co', email: 'j.wilson@design.co', phone: '555-0124', status: 'Contacted', priority: 'Warm' },
        { _id: '3', name: 'Robert Chen', company: 'Growth AI', email: 'robert@growthai.io', phone: '555-0125', status: 'Qualified', priority: 'Hot' },
        { _id: '4', name: 'Emily Davis', company: 'SoftSystems', email: 'emily@soft.sys', phone: '555-0126', status: 'Won', priority: 'Cold' },
        { _id: '5', name: 'Michael Brown', company: 'LogiTech', email: 'mbrown@logi.tech', phone: '555-0127', status: 'Lost', priority: 'Warm' }
    ];
    saveLeads(defaults);
    return defaults;
}

function saveLeads(leads) {
    localStorage.setItem('ace_leads', JSON.stringify(leads));
}
