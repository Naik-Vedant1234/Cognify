const API_URL = 'https://cognify-gxaa.onrender.com/api';

// Tab switching
document.getElementById('loginTab').addEventListener('click', () => {
    document.getElementById('loginTab').classList.add('active');
    document.getElementById('signupTab').classList.remove('active');
    document.getElementById('loginForm').classList.add('active');
    document.getElementById('signupForm').classList.remove('active');
    clearMessages();
});

document.getElementById('signupTab').addEventListener('click', () => {
    document.getElementById('signupTab').classList.add('active');
    document.getElementById('loginTab').classList.remove('active');
    document.getElementById('signupForm').classList.add('active');
    document.getElementById('loginForm').classList.remove('active');
    clearMessages();
});

// Login
document.getElementById('loginBtn').addEventListener('click', async () => {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        showError('Please fill in all fields');
        return;
    }

    const btn = document.getElementById('loginBtn');
    btn.disabled = true;
    btn.textContent = 'Logging in...';

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }

        // Store token and user data
        await chrome.storage.local.set({
            authToken: data.token,
            userId: data.user.userId,
            userEmail: data.user.email,
            userName: data.user.name
        });

        showSuccess('Login successful! Redirecting...');
        setTimeout(() => {
            window.location.href = 'popup.html';
        }, 1000);

    } catch (error) {
        showError(error.message);
        btn.disabled = false;
        btn.textContent = 'Login';
    }
});

// Signup
document.getElementById('signupBtn').addEventListener('click', async () => {
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;

    if (!name || !email || !password) {
        showError('Please fill in all fields');
        return;
    }

    if (password.length < 6) {
        showError('Password must be at least 6 characters');
        return;
    }

    const btn = document.getElementById('signupBtn');
    btn.disabled = true;
    btn.textContent = 'Creating account...';

    try {
        const response = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Signup failed');
        }

        // Store token and user data
        await chrome.storage.local.set({
            authToken: data.token,
            userId: data.user.userId,
            userEmail: data.user.email,
            userName: data.user.name
        });

        showSuccess('Account created! Redirecting...');
        setTimeout(() => {
            window.location.href = 'popup.html';
        }, 1000);

    } catch (error) {
        showError(error.message);
        btn.disabled = false;
        btn.textContent = 'Sign Up';
    }
});

// Helper functions
function showError(message) {
    const errorDiv = document.getElementById('errorMsg');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    document.getElementById('successMsg').style.display = 'none';
}

function showSuccess(message) {
    const successDiv = document.getElementById('successMsg');
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    document.getElementById('errorMsg').style.display = 'none';
}

function clearMessages() {
    document.getElementById('errorMsg').style.display = 'none';
    document.getElementById('successMsg').style.display = 'none';
}

// Enter key support
document.getElementById('loginPassword').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') document.getElementById('loginBtn').click();
});

document.getElementById('signupPassword').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') document.getElementById('signupBtn').click();
});
