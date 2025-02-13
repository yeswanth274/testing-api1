const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3010;

// Middleware to parse JSON requests
app.use(express.json());

// Define a route for the homepage
app.get('/', (req, res) => {
    res.send('Hello, Express! The server is working.');
});

// Load student data from JSON file
const loadStudentData = () => {
    const dataPath = path.join(__dirname, 'data.json');

    if (!fs.existsSync(dataPath)) {
        console.error('Error: data.json file is missing.');
        return [];
    }

    try {
        const rawData = fs.readFileSync(dataPath, 'utf8');
        return JSON.parse(rawData);
    } catch (error) {
        console.error('Error reading student data:', error);
        return [];
    }
};

// POST endpoint to get students above threshold
app.post('/students/above-threshold', (req, res) => {
    const { threshold } = req.body;

    // Validate input
    if (typeof threshold !== 'number' || threshold < 0) {
        return res.status(400).json({ error: 'Invalid threshold value. Must be a positive number.' });
    }

    const students = loadStudentData();
    if (students.length === 0) {
        return res.status(500).json({ error: 'Student data is missing or could not be loaded.' });
    }

    const filteredStudents = students.filter(student => student.total > threshold);

    res.json({
        count: filteredStudents.length,
        students: filteredStudents.map(({ name, total }) => ({ name, total }))
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});