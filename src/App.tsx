import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3001/api/entries';

export default function App() {
  const [entries, setEntries] = useState<any[]>([]);
  const [date, setDate] = useState('');
  const [project, setProject] = useState('');
  const [hours, setHours] = useState('');
  const [description, setDescription] = useState('');

  const projects = ['Viso Internal', 'Client A', 'Client B', 'Personal Development'];

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setEntries(data);
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  const addEntry = async () => {
    if (date && project && hours && description) {
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date, project, hours: parseFloat(hours), description })
        });
        
        if (response.ok) {
          setDate('');
          setProject('');
          setHours('');
          setDescription('');
          fetchEntries();
        }
      } catch (error) {
        console.error('Error adding entry:', error);
      }
    } else {
      alert("Please fill all fields");
    }
  };

  const deleteEntry = async (id: any) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchEntries();
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  return (
    <div>
      <h1>Timesheet App</h1>
      
      <div>
        <h2>Add Entry</h2>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <select value={project} onChange={(e) => setProject(e.target.value)}>
          <option value="">Select Project</option>
          {projects.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <input type="number" placeholder="Hours" value={hours} onChange={(e) => setHours(e.target.value)} />
        <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <button onClick={addEntry}>Add</button>
      </div>

      <div>
        <h2>Entries</h2>
        {entries.map((entry) => (
          <div key={entry.id}>
            <span>{entry.date} - {entry.project} - {entry.hours}h - {entry.description}</span>
            <button onClick={() => deleteEntry(entry.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
