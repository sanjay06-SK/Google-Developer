import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'database.sqlite');

export async function getDb() {
  return open({
    filename: dbPath,
    driver: sqlite3.Database
  });
}

export async function initDb() {
  const db = await getDb();
  
  await db.exec(`
    CREATE TABLE IF NOT EXISTS volunteers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      distance TEXT,
      status TEXT DEFAULT 'available'
    );
    
    CREATE TABLE IF NOT EXISTS allocations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      location TEXT NOT NULL,
      status TEXT DEFAULT 'Pending',
      type TEXT DEFAULT 'info',
      progress INTEGER DEFAULT 0,
      time TEXT
    );
  `);

  // Seed data if empty
  const volCountRow = await db.get('SELECT COUNT(*) as count FROM volunteers');
  if (volCountRow.count === 0) {
    console.log('Seeding volunteers data...');
    await db.run(`INSERT INTO volunteers (name, role, distance, status) VALUES 
      ('Sarah Jenkins', 'Medical Ops', '1.2km', 'available'),
      ('David Chen', 'Logistics', '3.4km', 'available'),
      ('Maria Garcia', 'Field Lead', '4.1km', 'deployed'),
      ('James Wilson', 'Support', '5.0km', 'available')
    `);
  }

  const allocCountRow = await db.get('SELECT COUNT(*) as count FROM allocations');
  if (allocCountRow.count === 0) {
    console.log('Seeding allocations data...');
    await db.run(`INSERT INTO allocations (title, location, status, type, progress, time) VALUES 
      ('Medical Supply Distribution', 'North District Zone A', 'In Progress', 'info', 65, '2 hrs ago'),
      ('Storm Relief Team Deployment', 'Coastal Region Area 4', 'Urgent', 'danger', 30, '30 mins ago'),
      ('Community Kitchen Staffing', 'City Center South', 'Completed', 'success', 100, '5 hrs ago'),
      ('Transport Dispatch coordination', 'Logistics Hub B', 'Pending', 'warning', 10, '1 hr ago')
    `);
  }
  
  console.log('Database initialized successfully.');
}
