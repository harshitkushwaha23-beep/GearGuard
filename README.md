# 🛡️ GearGuard - Ultimate Maintenance Tracker

GearGuard is a premium, full-stack maintenance management system designed for manufacturing and industrial environments. It streamlines equipment tracking, maintenance request workflows, and technician scheduling with a modern, "Glassmorphism" UI.

## 🎥 Demo Video

[Insert Demo Video Link Here]

![Dashboard Preview](frontend/src/assets/smart_button_demo.png)

## ✨ Key Features

### 🏭 Equipment Management
- **Smart Buttons**: Real-time "Open Issue" badges on equipment cards. Click to view detailed history.
- **Scrap Automation**: Automatically marks equipment as "Scrapped" when maintenance requests moves to the Scrap stage.
- **Full Lifecycle**: Track purchase dates, warranty info, and location.

### 🔧 Maintenance Workflows
- **Intelligent Requests**: Auto-fill logic populates Category and Assigned Team based on selected equipment.
- **Kanban Board**: Drag-and-drop request management (New -> In Progress -> Repaired -> Scrap).
- **Overdue Indicators**: Visual red alerts for requests past their due date.
- **Calendar View**: dedicated view for Preventive Maintenance schedules.

### 👥 Role-Based Access
- **Manager**: Full control over equipment, teams, and analytics.
- **Technician**: Focused "My Tasks" view and Kanban board access.
- **Employee**: Simple "Report Issue" interface.

## 🛠️ Tech Stack
- **Frontend**: React, Vite, TailwindCSS v4, @dnd-kit (Kanban), react-calendar
- **Backend**: Node.js, Express, PostgreSQL
- **Database**: PostgreSQL with `pg` driver

---

## 🚀 Setup Instructions

### Backend (Node.js)

1. **Navigate to backend:**
   ```sh
   cd backend
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure Environment:**
   Create a `.env` file:
   ```
   ORIGIN_URLS=http://localhost:5173,http://127.0.0.1:5173
   DATABASE_URL=postgres://user:password@localhost:5432/gearguard
   JWT_SECRET=your_secret_key
   ```

4. **Seed Database (Optional but Recommended):**
   ```sh
   npm run seed
   ```

5. **Start Server:**
   ```sh
   npm run dev
   ```

### Frontend (React)

1. **Navigate to frontend:**
   ```sh
   cd frontend
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure Environment:**
   Create a `.env` file:
   ```
   VITE_BACKEND_URL=http://localhost:5000
   ```

4. **Start Application:**
   ```sh
   npm run dev
   ```
