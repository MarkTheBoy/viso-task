# Timesheet App

A full-stack timesheet application for tracking work hours across projects with validation and persistence.

## Architecture Overview

### Tech Stack
- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Express.js + Node.js
- **Database**: SQLite3 with Prisma ORM
- **Styling**: CSS with responsive design

### Project Structure
```
viso-task/
├── src/                          # Frontend (React)
│   ├── App.tsx                   # Main React component
│   └── main.tsx                  # React entry point
├── backend/                      # Backend (Express)
│   ├── server.js                 # Express server
│   ├── package.json              # Backend dependencies
│   └── prisma/
│       ├── schema.prisma         # Database schema
│       └── migrations/           # Database migrations
├── index.html                    # HTML entry point
├── index.css                     # Global styles
├── package.json                  # Frontend dependencies
├── vite.config.ts                # Vite configuration
└── .gitignore                    # Git ignore rules
```

## Features

✅ **Time Entry Management**
- Add time entries with date, project, hours, and description
- Delete existing entries
- View all entries organized by date

✅ **Validation**
- Maximum 24 hours per calendar day
- All fields required (date, project, hours, description)
- Hours must be positive numbers
- Real-time error feedback

✅ **Entry History**
- Entries grouped by date (newest first)
- Daily total hours per date
- Grand total hours across all entries

✅ **Data Persistence**
- SQLite database for reliable data storage
- Prisma ORM for type-safe queries
- Automatic schema management with migrations

## Installation & Setup

### Prerequisites
- Node.js v20.11.0 or higher
- npm (comes with Node.js)

### Step 1: Clone and Install Dependencies

```bash
# Navigate to project root
cd viso-task

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Step 2: Setup Database

```bash
# Navigate to backend directory
cd backend

# Run Prisma migrations (creates SQLite database)
npx prisma migrate dev --name init

cd ..
```

This will:
- Create `backend/timesheet.db` (SQLite database file)
- Set up the `entries` table with the correct schema
- Generate Prisma Client

### Step 3: Start Development Servers

**Terminal 1 - Start Frontend:**
```bash
npm run dev
# Frontend runs on http://localhost:5175
```

**Terminal 2 - Start Backend:**
```bash
cd backend
node server.js
# Backend runs on http://localhost:3001
```

The app will be available at `http://localhost:5175`

## Usage

### Adding an Entry
1. Select a date
2. Choose a project from the dropdown
3. Enter hours worked (0-24, must be positive)
4. Add description of work
5. Click "Add"

### Viewing Entries
- Entries are automatically grouped by date
- Each date shows:
  - Date header
  - Daily total hours
  - Individual entries with project, hours, and description
- Grand total shown at the top

### Deleting an Entry
- Click the "Delete" button next to any entry

### Validation
- **24-hour limit**: Backend prevents adding hours that exceed 24h per day
- **Required fields**: All fields (date, project, hours, description) are mandatory
- **Positive hours**: Hours must be greater than 0
- Error messages display if validation fails

## API Endpoints

All endpoints are prefixed with `/api`

### GET /entries
Returns all time entries sorted by date (newest first)

**Response:**
```json
[
  {
    "id": 1,
    "date": "2024-01-15",
    "project": "Viso Internal",
    "hours": 8,
    "description": "Feature development",
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

### POST /entries
Creates a new time entry

**Request body:**
```json
{
  "date": "2024-01-15",
  "project": "Viso Internal",
  "hours": 8,
  "description": "Feature development"
}
```

**Validation errors:**
- Missing fields: "All fields are required"
- Invalid hours: "Hours must be a positive number"
- Exceeds 24h: "Cannot add Xh. Maximum 24 hours per day..."

### DELETE /entries/:id
Deletes a time entry by ID

**Response:**
```json
{
  "deleted": 1
}
```

## Database Schema

**Entry Model**
```prisma
model Entry {
  id          Int      @id @default(autoincrement())
  date        String   // Format: YYYY-MM-DD
  project     String
  hours       Float    // 0.5 to 24
  description String
  createdAt   DateTime @default(now())
}
```

## Development Commands

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Backend
```bash
cd backend
node server.js                           # Start server
npx prisma studio                        # Open Prisma Studio (GUI)
npx prisma db push                       # Sync schema with database
npx prisma generate                      # Regenerate Prisma Client
```

## Environment Setup

No environment variables required! The app uses:
- Frontend: `http://localhost:5175` (Vite default)
- Backend: `http://localhost:3001` (configured in server.js)
- Database: `backend/timesheet.db` (local SQLite file)

For production, you may want to add `.env` files for configuration.

## Troubleshooting

### Database Issues
```bash
# Reset database (WARNING: deletes all data)
cd backend
rm timesheet.db
npx prisma migrate dev --name init
```

### Port Already in Use
- Frontend: Change port in `vite.config.ts`
- Backend: Change PORT variable in `backend/server.js`

### Prisma Client Not Generated
```bash
cd backend
npx prisma generate
```

### Frontend Won't Connect to Backend
- Verify backend is running on `http://localhost:3001`
- Check CORS is enabled in `backend/server.js`
- Verify API_URL in `src/App.tsx` matches backend port

## Performance Notes

- SQLite is suitable for small to medium projects (< 100k entries)
- For larger datasets, consider migrating to PostgreSQL:
  1. Change `datasource` in `prisma/schema.prisma`
  2. Update backend database connection
  3. Run `npx prisma migrate deploy`

## License

MIT

## Author

Created: January 15, 2026
