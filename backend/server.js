
import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Database setup
const db = new sqlite3.Database('./timesheet.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    db.run(`CREATE TABLE IF NOT EXISTS entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      project TEXT NOT NULL,
      hours REAL NOT NULL,
      description TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  }
});

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Timesheet API is running', endpoints: ['/api/entries'] });
});

// Get all entries
app.get('/api/entries', (req, res) => {
  db.all('SELECT * FROM entries ORDER BY date DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Add new entry
app.post('/api/entries', (req, res) => {
  const { date, project, hours, description } = req.body;
  
  if (!date || !project || !hours || !description) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }

  const numHours = parseFloat(hours);
  if (numHours <= 0) {
    res.status(400).json({ error: 'Hours must be a positive number' });
    return;
  }

  // Check total hours for the date
  db.get('SELECT SUM(hours) as totalHours FROM entries WHERE date = ?', [date], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const currentTotal = row?.totalHours || 0;
    if (currentTotal + numHours > 24) {
      res.status(400).json({ 
        error: `Cannot add ${numHours}h. Maximum 24 hours per day. Current: ${currentTotal}h, Available: ${24 - currentTotal}h` 
      });
      return;
    }

    db.run(
      'INSERT INTO entries (date, project, hours, description) VALUES (?, ?, ?, ?)',
      [date, project, numHours, description],
      function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ id: this.lastID, date, project, hours: numHours, description });
      }
    );
  });
});

// Delete entry
app.delete('/api/entries/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM entries WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ deleted: this.changes });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
