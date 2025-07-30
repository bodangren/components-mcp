import { promises as fs } from 'fs';
import path from 'path';
import { DB } from './types';

const dbPath = path.join(__dirname, '..', 'data', 'db.json');

export async function readDB(): Promise<DB> {
  try {
    const data = await fs.readFile(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading DB file:', error);
    // Initialize with empty arrays if file doesn't exist or is invalid
    return {
      components: [],
      apis: [],
      environmentVars: [],
      styling: [],
      stateManagement: [],
      customHooks: [],
      codeConventions: [],
    };
  }
}

export async function writeDB(db: DB): Promise<void> {
  try {
    await fs.writeFile(dbPath, JSON.stringify(db, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing DB file:', error);
  }
}
