
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const PORT = 3001;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Timesheet API is running', endpoints: ['/api/entries'] });
});

// Get all entries
app.get('/api/entries', async (req, res) => {
  try {
    const entries = await prisma.entry.findMany({
      orderBy: { date: 'desc' }
    });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new entry
app.post('/api/entries', async (req, res) => {
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

  try {
    // Check total hours for the date
    const dayEntries = await prisma.entry.findMany({
      where: { date }
    });
    
    const currentTotal = dayEntries.reduce((sum, entry) => sum + entry.hours, 0);
    
    if (currentTotal + numHours > 24) {
      res.status(400).json({ 
        error: `Cannot add ${numHours}h. Maximum 24 hours per day. Current: ${currentTotal}h, Available: ${24 - currentTotal}h` 
      });
      return;
    }

    const entry = await prisma.entry.create({
      data: {
        date,
        project,
        hours: numHours,
        description
      }
    });
    
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete entry
app.delete('/api/entries/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    await prisma.entry.delete({
      where: { id: parseInt(id) }
    });
    res.json({ deleted: 1 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
