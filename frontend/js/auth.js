// Check if searching for a redirect loop, otherwise clear old session to ensure clean login
// localStorage.removeItem('token');
// localStorage.removeItem('user');

// We do NOT auto-redirect anymore to strictly follow: "Login page first"


const loginForm = document.getElementById('login-form');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                window.location.href = 'dashboard.html';
            } else {
                alert(data.error);
            }
        } catch (err) {
            console.error(err);
            if (window.location.protocol === 'https:' && err.message.includes('Failed to fetch')) {
                alert('Login Failed: Mixed Content Error.\n\nYour frontend is on HTTPS (Vercel) but backend is on HTTP (Localhost).\n\nPlease run the project LOCALLY (open index.html on your PC) to test it.');
            } else {
                alert('Login failed. Backend connection refused.\nMake sure the server is running on port 5000.');
            }
        }
    });
}
});
