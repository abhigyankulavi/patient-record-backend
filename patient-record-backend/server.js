const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());

// Set up storage with multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Define endpoint to handle file upload
app.post('/upload-ehr', upload.single('ehr'), (req, res) => {
    const { name, age, gender, contact, address, allergies, chronic_conditions } = req.body;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }

    res.json({ message: 'Data uploaded successfully', filePath: `/uploads/${file.filename}` });
});

// Endpoint to fetch example data
app.get('/fetch-ehr', (req, res) => {
    res.json({ message: 'Sample EHR data retrieved' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
