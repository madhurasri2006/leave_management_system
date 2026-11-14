
const loginForm = document.getElementById('loginForm');
const message = document.getElementById('message');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const isAdmin = window.location.pathname.includes('admin-login');

    const url = isAdmin
        ? '/api/auth/admin-login'
        : '/api/auth/employee-login';

    const data = isAdmin
        ? {
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
        }
        : {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Login failed');
        }

        localStorage.setItem('token', result.token);
        localStorage.setItem('role', result.role);
        localStorage.setItem('name', result.name || 'Admin');

        if (isAdmin && result.role === 'admin') {
            window.location.href = 'admin.html';
        }
        else if (!isAdmin && result.role === 'employee') {
            window.location.href = 'employee.html';
        }
        else {
            throw new Error('Invalid user role');
        }

    } catch (error) {
        message.textContent = error.message;
        message.style.color = 'red';
    }
});
