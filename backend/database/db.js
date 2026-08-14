import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isTest = process.env.NODE_ENV === 'test';
const dbPath = isTest 
  ? ':memory:' 
  : path.join(__dirname, 'taskflow.db');

const db = new Database(dbPath);

db.pragma('foreign_keys = ON');

export function initDb() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const seedPath = path.join(__dirname, 'seed.sql');

  if (fs.existsSync(schemaPath)) {
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schemaSql);
  }

  const boardCount = db.prepare('SELECT COUNT(*) as count FROM boards').get();
  if (boardCount.count === 0 && fs.existsSync(seedPath)) {
    const seedSql = fs.readFileSync(seedPath, 'utf8');
    db.exec(seedSql);
  }
}

initDb();

export { db };
export default db;
