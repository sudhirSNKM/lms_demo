document.addEventListener('DOMContentLoaded', () => {
    // Auth Check
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user) {
        window.location.href = 'index.html';
        return;
    }

    // Set User Info UI
    document.getElementById('user-name').textContent = user.name;
    document.getElementById('user-avatar').textContent = user.name.charAt(0).toUpperCase();

    // Profile Init
    if (document.getElementById('profile-name')) {
        document.getElementById('profile-name').value = user.name;
        document.getElementById('profile-email').value = user.email;
    }

    // Header Profile Click
    document.querySelector('.user-profile').style.cursor = 'pointer';
    document.querySelector('.user-profile').addEventListener('click', () => {
        // Switch to profile view
        const navItems = document.querySelectorAll('.nav-item');
        const views = document.querySelectorAll('.view-section');
        navItems.forEach(nav => nav.classList.remove('active'));
        views.forEach(view => view.style.display = 'none');
        document.getElementById('view-profile').style.display = 'block';
    });

    // Load Data
    loadLeads();

    // === NEW FEATURES ===

    // 1. Export CSV
    if (document.querySelector('.leads-section .section-header')) {
        const btn = document.createElement('button');
        btn.innerText = 'Export CSV';
        btn.className = 'add-btn';
        btn.style.background = 'var(--success-color)';
        btn.style.marginRight = '10px';
        btn.onclick = () => {
            const keys = ['name', 'company', 'email', 'phone', 'status', 'priority'];
            let csv = keys.join(',') + '\n';
            globalLeads.forEach(row => {
                csv += keys.map(k => row[k]).join(',') + '\n';
            });
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'leads.csv';
            a.click();
        };
        document.querySelector('.leads-section .section-header > div').prepend(btn);
    }

    // Init Drag Logic (Call after render)
    // ... logic inside renderPipeline


    // Profile Forms Logic
    const profileDetailsForm = document.getElementById('profile-details-form');
    if (profileDetailsForm) {
        profileDetailsForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('profile-name').value;
            const email = document.getElementById('profile-email').value;

            try {
                const res = await fetchAPI('/auth/updatedetails', 'PUT', { name, email });
                if (res.success) {
                    localStorage.setItem('user', JSON.stringify(res.data));
                    alert('Profile updated successfully!');
                    window.location.reload();
                }
            } catch (err) {
                alert(err.message);
            }
        });
    }

    const passwordForm = document.getElementById('profile-password-form');
    if (passwordForm) {
        passwordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (newPassword !== confirmPassword) {
                alert('New passwords do not match');
                return;
            }

            try {
                await fetchAPI('/auth/updatepassword', 'PUT', { currentPassword, newPassword });
                alert('Password updated successfully!');
                passwordForm.reset();
            } catch (err) {
                alert(err.message);
            }
        });
    }


    // Logout logic
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    });

    // Modal Logic
    const modal = document.getElementById('lead-modal');
    const openModalBtn = document.getElementById('open-modal-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const leadForm = document.getElementById('lead-form');
    const modalTitle = document.getElementById('modal-title');

    openModalBtn.addEventListener('click', () => {
        modalTitle.textContent = 'Add New Lead';
        leadForm.reset();
        document.getElementById('lead-id').value = '';
        modal.classList.add('active');
    });

    closeModalBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.classList.remove('active');
        }
    };

    // Navigation Logic
    const navItems = document.querySelectorAll('.nav-item');
    const views = document.querySelectorAll('.view-section');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            if (item.id === 'logout-btn') return;

            // Remove active class from all
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add to clicked
            item.classList.add('active');

            // Hide all views
            views.forEach(view => view.style.display = 'none');

            // Show selected view
            const viewName = item.textContent.trim().toLowerCase();
            const targetView = document.getElementById(`view-${viewName === 'dashboard' ? 'dashboard' : viewName}`);

            if (targetView) {
                targetView.style.display = 'block';
                // Refresh data if needed
                if (viewName === 'pipeline') renderPipeline();
                if (viewName === 'activities') loadActivities();
            }
        });
    });

    // Search Logic
    const searchInput = document.getElementById('search-leads');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('#leads-table-body tr');

            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(term) ? '' : 'none';
            });
        });
    }

    // Form Submit
    leadForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = document.getElementById('lead-id').value;
        const leadData = {
            name: document.getElementById('lead-name').value,
            company: document.getElementById('lead-company').value,
            email: document.getElementById('lead-email').value,
            phone: document.getElementById('lead-phone').value,
            status: document.getElementById('lead-status').value,
            priority: document.getElementById('lead-priority').value
        };

        try {
            if (id) {
                await fetchAPI(`/leads/${id}`, 'PUT', leadData);
            } else {
                await fetchAPI('/leads', 'POST', leadData);
            }
            modal.classList.remove('active');
            loadLeads();
            renderPipeline();
        } catch (err) {
            alert(err.message);
        }
    });
});

let globalLeads = [];

async function loadLeads() {
    try {
        const response = await fetchAPI('/leads');
        globalLeads = response.data;
        renderStats(globalLeads);
        renderTable(globalLeads);
    } catch (err) {
        console.error('Failed to load leads', err);
    }
}

async function loadActivities() {
    try {
        const response = await fetchAPI('/activities');
        const activities = response.data;
        const list = document.getElementById('activity-list');
        list.innerHTML = '';

        activities.forEach(act => {
            const li = document.createElement('li');
            li.style.padding = '1rem';
            li.style.borderBottom = '1px solid var(--glass-border)';
            li.innerHTML = `
                <div style="display: flex; justify-content: space-between;">
                    <span style="font-weight: bold; color: var(--primary-color)">${act.action}</span>
                    <span style="font-size: 0.8rem; color: #94a3b8">${new Date(act.createdAt).toLocaleString()}</span>
                </div>
                <div style="margin-top: 0.5rem;">${act.description}</div>
                <div style="font-size: 0.8rem; color: #94a3b8; margin-top: 0.25rem;">By: ${act.user || 'System'}</div>
            `;
            list.appendChild(li);
        });
    } catch (err) {
        console.error(err);
    }
}

function renderStats(leads) {
    document.getElementById('total-leads').textContent = leads.length;
    document.getElementById('new-leads').textContent = leads.filter(l => l.status === 'New').length;
    document.getElementById('hot-leads').textContent = leads.filter(l => l.priority === 'Hot').length;
}

function calculateAIScore(lead) {
    let score = 0;
    // Priority Weight
    if (lead.priority === 'Hot') score += 40;
    if (lead.priority === 'Warm') score += 20;
    if (lead.priority === 'Cold') score += 10;

    // Status Progress Weight
    if (lead.status === 'Won') score += 60;
    if (lead.status === 'Qualified') score += 40;
    if (lead.status === 'Contacted') score += 20;
    if (lead.status === 'New') score += 10;

    // Cap at 99
    return Math.min(score, 99);
}

function renderTable(leads) {
    const tbody = document.getElementById('leads-table-body');
    tbody.innerHTML = '';

    leads.forEach(lead => {
        const score = calculateAIScore(lead);
        let scoreColor = '#60a5fa';
        if (score > 70) scoreColor = '#22c55e';
        else if (score > 40) scoreColor = '#eab308';
        else scoreColor = '#ef4444';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div style="font-weight: 600;">${lead.name}</div>
                <div style="font-size: 0.75rem; color: #94a3b8;">${lead.email}</div>
            </td>
            <td>${lead.company}</td>
            <td><span class="status-badge status-${lead.status.toLowerCase()}">${lead.status}</span></td>
            <td><span class="priority-${lead.priority.toLowerCase()}">${lead.priority}</span></td>
            <td>
                 <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <div style="width: 100%; max-width: 60px; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px;">
                        <div style="width: ${score}%; height: 100%; background: ${scoreColor}; border-radius: 3px;"></div>
                    </div>
                    <span style="font-size: 0.8rem; font-weight: bold;">${score}</span>
                 </div>
            </td>
            <td>
                <button onclick="editLead('${lead._id}')" style="background: none; border: none; color: var(--primary-color); cursor: pointer; margin-right: 0.5rem;">Edit</button>
                <button onclick="deleteLead('${lead._id}')" style="background: none; border: none; color: var(--danger-color); cursor: pointer;">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderPipeline() {
    const container = document.querySelector('.pipeline-container');
    if (!container) return;
    container.innerHTML = '';

    const stages = ['New', 'Contacted', 'Qualified', 'Won', 'Lost'];

    stages.forEach(stage => {
        const stageLeads = globalLeads.filter(l => l.status === stage);
        const col = document.createElement('div');
        col.style.minWidth = '250px';
        col.style.background = 'var(--glass-bg)';
        col.style.borderRadius = '0.5rem';
        col.style.padding = '1rem';
        col.style.border = '1px solid var(--glass-border)';

        // Drag Drop Attributes
        col.setAttribute('data-stage', stage);
        col.addEventListener('dragover', e => e.preventDefault());
        col.addEventListener('drop', handleDrop);

        // Let's build the innerHTML with ondragstart
        const cards = stageLeads.map(lead => `
            <div class="glass-card" draggable="true" ondragstart="handleDragStart(event, '${lead._id}')" style="margin-bottom: 0.5rem; padding: 1rem; cursor: grab; position: relative;" onclick="editLead('${lead._id}')">
                 <div style="position: absolute; top: 10px; right: 10px; cursor: pointer; color: var(--primary-color);" onclick="event.stopPropagation(); generateEmail('${lead.name}', '${lead.status}')" title="AI Email Draft">✨</div>
                <div style="font-weight: bold; margin-bottom: 0.25rem;">${lead.name}</div>
                <div style="font-size: 0.8rem; color: #94a3b8; margin-bottom: 0.5rem;">${lead.company}</div>
                <span class="priority-${lead.priority.toLowerCase()}" style="font-size: 0.75rem;">${lead.priority}</span>
            </div>
        `).join('');

        col.innerHTML = `
            <h4 style="margin-bottom: 1rem; color: var(--primary-color); text-transform: uppercase; font-size: 0.8rem; letter-spacing: 1px;">${stage} (${stageLeads.length})</h4>
            <div style="display: flex; flex-direction: column; gap: 0.5rem; min-height: 200px;">
                ${cards}
            </div>
        `;

        container.appendChild(col);
    });
}

// Drag & Drop Handlers
let draggedLeadId = null;

window.handleDragStart = (e, id) => {
    draggedLeadId = id;
    e.dataTransfer.effectAllowed = 'move';
};

window.handleDrop = async (e) => {
    e.preventDefault();
    const stage = e.currentTarget.getAttribute('data-stage');
    if (!draggedLeadId || !stage) return;

    // Find lead
    const lead = globalLeads.find(l => l._id === draggedLeadId);
    if (lead && lead.status !== stage) {
        // Optimistic UI Update
        lead.status = stage;
        renderPipeline();
        renderTable(globalLeads); // update table too if consistent

        try {
            await fetchAPI(`/leads/${draggedLeadId}`, 'PUT', { status: stage });
            // Add activity log manually or rely on backend
        } catch (err) {
            console.error(err);
            alert('Failed to move lead');
            loadLeads(); // revert
        }
    }
    draggedLeadId = null;
};

// AI Email Feature
window.generateEmail = (name, status) => {
    let subject = '';
    let body = '';

    if (status === 'New') {
        subject = `Introduction: AI Solutions for ${name}`;
        body = `Hi ${name},\n\nI noticed your company is looking for innovative solutions. We specialize in AI-driven tools that can scale your operations.\n\nAre you available for a quick chat this week?\n\nBest,\nACE Team`;
    } else if (status === 'Qualified') {
        subject = `Next Steps for ${name}`;
        body = `Hi ${name},\n\nIt was great speaking with you. Based on our requirements, I believe we are a perfect match.\n\nI've attached the proposal. Let me know what you think.\n\nBest,\nACE Team`;
    } else if (status === 'Won') {
        subject = `Welcome to ACE!`;
        body = `Hi ${name},\n\nThrilled to have you on board! Let's get started on the onboarding process.\n\nCheers!`;
    } else {
        subject = `Checking in - ${name}`;
        body = `Hi ${name},\n\nJust wanted to circle back and see if you had any thoughts on our previous conversation.\n\nBest,\nACE Team`;
    }

    const text = `Subject: ${subject}\n\n${body}`;
    navigator.clipboard.writeText(text).then(() => {
        alert('✨ AI Email Draft copied to clipboard!\n\n' + text);
    });
};


window.editLead = async (id) => {
    try {
        const res = await fetchAPI(`/leads/${id}`);
        const lead = res.data;

        document.getElementById('lead-id').value = lead._id;
        document.getElementById('lead-name').value = lead.name;
        document.getElementById('lead-company').value = lead.company;
        document.getElementById('lead-email').value = lead.email;
        document.getElementById('lead-phone').value = lead.phone;
        document.getElementById('lead-status').value = lead.status;
        document.getElementById('lead-priority').value = lead.priority;

        document.getElementById('modal-title').textContent = 'Edit Lead';
        document.getElementById('lead-modal').classList.add('active');
    } catch (err) {
        console.error(err);
    }
};

window.deleteLead = async (id) => {
    if (confirm('Are you sure you want to delete this lead?')) {
        try {
            await fetchAPI(`/leads/${id}`, 'DELETE');
            loadLeads();
        } catch (err) {
            alert(err.message);
        }
    }
};
