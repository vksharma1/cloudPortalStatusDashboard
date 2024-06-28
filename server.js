// server.js

const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files (e.g., index.html)
app.use(express.static('public'));

// Initialize status history
let statusHistory = [];

// Route to check website status
app.get('/check-website-status', async (req, res) => {
    try {
        const websiteUrl = process.env.WEBSITE_URL; // URL of the website to check
        const response = await axios.get(websiteUrl);
        if (response.status === 200) {
            updateStatusHistory('Website', 'up');
            res.status(200).json({ status: 'up', message: 'Website is up and running.' });
        } else {
            updateStatusHistory('Website', 'down');
            res.status(500).json({ status: 'down', message: 'Website is not accessible.' });
        }
    } catch (error) {
        console.error('Error checking website status:', error.message);
        updateStatusHistory('Website', 'error');
        res.status(500).json({ status: 'error', message: 'Error checking website status.' });
    }
});

// Route to check website login status (example)
app.get('/check-login-status', async (req, res) => {
    try {
        // Example: Check if login endpoint returns successful response
        const loginUrl = process.env.LOGIN_URL; // URL of the login endpoint
        const response = await axios.get(loginUrl);
        if (response.status === 200) {
            updateStatusHistory('Login', 'up');
            res.status(200).json({ status: 'success', message: 'Login is working.' });
        } else {
            updateStatusHistory('Login', 'down');
            res.status(401).json({ status: 'fail', message: 'Login failed.' });
        }
    } catch (error) {
        console.error('Error checking login status:', error.message);
        updateStatusHistory('Login', 'error');
        res.status(500).json({ status: 'error', message: 'Error checking login status.' });
    }
});

// Function to update status history
const updateStatusHistory = (checkType, status) => {
    const timestamp = new Date().toLocaleString();
    const entry = { id: uuidv4(), checkType, status, timestamp };
    statusHistory.unshift(entry); // Add new entry to the beginning of the array
    if (statusHistory.length > 20) {
        statusHistory.pop(); // Limit history to 20 entries
    }
};

// Route to get status history
app.get('/status-history', (req, res) => {
    res.json(statusHistory);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

