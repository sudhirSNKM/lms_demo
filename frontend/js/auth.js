document.addEventListener('DOMContentLoaded', () => {
    // We do NOT auto-redirect anymore to strictly follow: "Login page first"
    // Users must explicitly click "Sign In" every time they land on index.html

    // Optional: Clear existing session to ensure a fresh login state
    // localStorage.removeItem('token');
    // localStorage.removeItem('user');

    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const data = await fetchAPI('/auth/login', 'POST', { email, password });

                if (data.success) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    window.location.href = 'dashboard.html';
                }
            } catch (err) {
                console.error(err);
                if (window.location.protocol === 'https:' && err.message.includes('Failed to fetch')) {
                    alert('Deployment Error: Your Frontend is online (Vercel) but Backend is offline (Localhost).\n\nTO SHARE THIS APP:\n1. Deploy the "backend" folder to Render.com.\n2. Update "frontend/js/api.js" with the new Render URL.');
                } else {
                    alert(err.message || 'Login failed');
                }
            }
        });
    }
});
