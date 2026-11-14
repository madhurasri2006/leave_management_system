
const API_URL = 'https://leave-management-system-mh1o.onrender.com';

const registerForm = document.getElementById('registerForm');
const message = document.getElementById('message');

registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const data = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        department: document.getElementById('department').value.trim(),
        password: document.getElementById('password').value
    };

    try {
        const response = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Registration failed');
        }

        message.textContent = 'Registration successful! Please login.';
        message.style.color = 'green';

        registerForm.reset();

    } catch (error) {
        message.textContent = error.message;
        message.style.color = 'red';
    }
});
