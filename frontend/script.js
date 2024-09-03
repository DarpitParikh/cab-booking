// frontend/script.js

const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');
const logoutBtn = document.getElementById('logout');

// Toggle between sign-up and sign-in forms
if (registerBtn && loginBtn) {
    registerBtn.addEventListener('click', () => {
        container.classList.add("active");
    });

    loginBtn.addEventListener('click', () => {
        container.classList.remove("active");
    });
}

// Handle Sign Up
const signupForm = document.getElementById('signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;

        fetch('http://localhost:3000/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                if (data.message === 'User registered successfully') {
                    // Switch to sign-in form
                    container.classList.remove("active");
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred during sign up.');
            });
    });
}

// Handle Login
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
            .then(response => response.json())
            .then(data => {
                if (data.token) {
                    alert('Login successful');
                    // Store the token for authenticated requests
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    // Redirect to dashboard
                    window.location.href = 'dashboard.html';
                } else {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred during login.');
            });
    });
}

// Handle Logout
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    });
}

// Fetch and display user data on Dashboard
const dashboard = document.querySelector('main .welcome');
if (dashboard) {
    document.addEventListener('DOMContentLoaded', () => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));

        if (!token) {
            alert('Please log in first.');
            window.location.href = 'index.html';
        } else {
            document.getElementById('user-name').textContent = user.name;
            fetchBookings(token);
        }
    });
}

// Fetch bookings and display on Dashboard
function fetchBookings(token) {
    fetch('http://localhost:3000/bookings', {
        headers: { 'Authorization': token }
    })
        .then(response => response.json())
        .then(data => {
            const bookingsList = document.getElementById('bookings-list');
            bookingsList.innerHTML = '';

            if (data.length === 0) {
                bookingsList.innerHTML = '<p>No bookings found.</p>';
                return;
            }

            data.forEach(booking => {
                const bookingItem = document.createElement('div');
                bookingItem.classList.add('booking-item');
                bookingItem.innerHTML = `
                    <h3>Booking #${booking.id}</h3>
                    <p><strong>Pickup:</strong> ${booking.pickup_location}</p>
                    <p><strong>Drop:</strong> ${booking.drop_location}</p>
                    <p><strong>Status:</strong> ${booking.status}</p>
                    <p><strong>Time:</strong> ${new Date(booking.booking_time).toLocaleString()}</p>
                `;
                bookingsList.appendChild(bookingItem);
            });
        })
        .catch(error => {
            console.error('Error fetching bookings:', error);
            alert('Failed to load bookings.');
        });
}

// Handle Booking Form Submission
const bookingForm = document.getElementById('booking-form');
if (bookingForm) {
    bookingForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const pickup = document.getElementById('pickup').value;
        const drop = document.getElementById('drop').value;
        const token = localStorage.getItem('token');

        fetch('http://localhost:3000/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ pickup_location: pickup, drop_location: drop })
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                if (data.message === 'Booking created successfully') {
                    bookingForm.reset();
                }
            })
            .catch(error => {
                console.error('Error creating booking:', error);
                alert('An error occurred while booking.');
            });
    });
}

// Fetch and display profile data
const profilePage = document.querySelector('main .profile');
if (profilePage) {
    document.addEventListener('DOMContentLoaded', () => {
        const token = localStorage.getItem('token');

        if (!token) {
            alert('Please log in first.');
            window.location.href = 'index.html';
        } else {
            fetchProfile(token);
        }
    });
}

// Fetch profile data
function fetchProfile(token) {
    fetch('http://localhost:3000/profile', {
        headers: { 'Authorization': token }
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('name').value = data.name;
            document.getElementById('email').value = data.email;
            // Populate other fields as necessary
        })
        .catch(error => {
            console.error('Error fetching profile:', error);
            alert('Failed to load profile.');
        });
}

// Handle Profile Update
const profileForm = document.getElementById('profile-form');
if (profileForm) {
    profileForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        // const email = document.getElementById('email').value; // Email is disabled

        const token = localStorage.getItem('token');

        // Implement profile update API if needed
        // For now, we'll just alert the user
        alert('Profile update functionality is not implemented yet.');
    });
}
