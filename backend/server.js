const express = require('express');
const path = require('path');  // This module helps to handle and transform file paths
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Temporary in-memory user storage
const users = [];

// Secret key for JWT
const JWT_SECRET = 'your_jwt_secret';

// Sign-up route
app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
    users.push({ username, password: hashedPassword });
    res.send({ message: 'User registered successfully' });
});

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(404).send({ message: 'User not found' });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).send({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user.username }, JWT_SECRET, { expiresIn: 86400 });
    res.send({ message: 'Login successful', token });
});

// Fallback to serve index.html for unknown routes (SPA handling)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
