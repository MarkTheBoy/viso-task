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
        
        const data = await response.json();
        
        if (response.ok) {
          setDate('');
          setProject('');
          setHours('');
          setDescription('');
          fetchEntries();
        } else {
          alert(data.error || 'Error adding entry');
        }
      } catch (error) {
        console.error('Error adding entry:', error);
        alert('Error adding entry');
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

  // Group entries by date
  const groupedEntries = entries.reduce((acc: any, entry: any) => {
    if (!acc[entry.date]) {
      acc[entry.date] = [];
    }
    acc[entry.date].push(entry);
    return acc;
  }, {});

  // Calculate grand total
  const grandTotal = entries.reduce((sum: number, entry: any) => sum + parseFloat(entry.hours), 0);

  // Get sorted dates
  const sortedDates = Object.keys(groupedEntries).sort().reverse();

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
        <h2>Entry History</h2>
        {entries.length === 0 ? (
          <p>No entries yet. Add your first time entry above.</p>
        ) : (
          <>
            <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '8px' }}>
              <strong>Grand Total: {grandTotal.toFixed(2)}h</strong>
            </div>
            {sortedDates.map((dateKey) => {
              const dayEntries = groupedEntries[dateKey];
              const dayTotal = dayEntries.reduce((sum: number, entry: any) => sum + parseFloat(entry.hours), 0);
              return (
                <div key={dateKey} style={{ marginBottom: '20px' }}>
                  <div style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '8px', marginBottom: '10px' }}>
                    <strong>{dateKey}</strong> | <strong>Day Total: {dayTotal.toFixed(2)}h</strong>
                  </div>
                  {dayEntries.map((entry: any) => (
                    <div key={entry.id} style={{ marginBottom: '8px' }}>
                      <span>{entry.project} | {entry.hours}h | {entry.description}</span>
                      <button onClick={() => deleteEntry(entry.id)}>Delete</button>
                    </div>
                  ))}
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
