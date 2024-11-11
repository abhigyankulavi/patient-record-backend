const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Set up SQLite database
const db = new sqlite3.Database('./patients.db', (err) => {
  if (err) console.error('Database connection error:', err.message);
  else console.log('Connected to SQLite database.');
});

// Create the patients table if it doesn’t exist
db.run(`
  CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    age INTEGER,
    gender TEXT,
    contact TEXT,
    address TEXT,
    allergies TEXT,
    chronic_conditions TEXT
  )
`);

// Configure file storage for uploaded EHRs
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// API endpoint to add a new patient
app.post('/api/patients', upload.single('ehr'), (req, res) => {
  const { name, age, gender, contact, address, allergies, chronic_conditions } = req.body;
  const ehr = req.file ? req.file.filename : null;

  db.run(
    `INSERT INTO patients (name, age, gender, contact, address, allergies, chronic_conditions)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, age, gender, contact, address, allergies, chronic_conditions],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    }
  );
});

// API endpoint to get all patients
app.get('/api/patients', (req, res) => {
  db.all(`SELECT * FROM patients`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
