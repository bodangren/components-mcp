import { Router } from 'express';
import { DB, IEnvironmentVar } from '../types';
import { readDB, writeDB } from '../utils';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Environment Variables
 *   description: API for managing environment variables
 */

/**
 * @swagger
 * /environment:
 *   get:
 *     summary: Get all environment variables
 *     tags: [Environment Variables]
 *     responses:
 *       200:
 *         description: A list of environment variables
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/IEnvironmentVar'
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
  try {
    const db: DB = await readDB();
    res.json(db.environmentVars);
  } catch (error) {
    res.status(500).json({ message: 'Error reading environment variables', error });
  }
});

/**
 * @swagger
 * /environment:
 *   post:
 *     summary: Add a new environment variable
 *     tags: [Environment Variables]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IEnvironmentVar'
 *     responses:
 *       201:
 *         description: The created environment variable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IEnvironmentVar'
 *       500:
 *         description: Server error
 */
router.post('/', async (req, res) => {
  try {
    const newEnvVar: IEnvironmentVar = req.body;
    const db: DB = await readDB();
    db.environmentVars.push(newEnvVar);
    await writeDB(db);
    res.status(201).json(newEnvVar);
  } catch (error) {
    res.status(500).json({ message: 'Error adding environment variable', error });
  }
});

/**
 * @swagger
 * /environment/{id}:
 *   put:
 *     summary: Update an environment variable by ID
 *     tags: [Environment Variables]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The environment variable ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IEnvironmentVar'
 *     responses:
 *       200:
 *         description: The updated environment variable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IEnvironmentVar'
 *       404:
 *         description: Environment variable not found
 *       500:
 *         description: Server error
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEnvVar: IEnvironmentVar = req.body;
    const db: DB = await readDB();
    const index = db.environmentVars.findIndex(env => env.id === id);
    if (index !== -1) {
      db.environmentVars[index] = updatedEnvVar;
      await writeDB(db);
      res.json(updatedEnvVar);
    } else {
      res.status(404).json({ message: 'Environment variable not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating environment variable', error });
  }
});

/**
 * @swagger
 * /environment/{id}:
 *   delete:
 *     summary: Delete an environment variable by ID
 *     tags: [Environment Variables]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The environment variable ID
 *     responses:
 *       204:
 *         description: Environment variable deleted successfully
 *       404:
 *         description: Environment variable not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db: DB = await readDB();
    const initialLength = db.environmentVars.length;
    db.environmentVars = db.environmentVars.filter(env => env.id !== id);
    if (db.environmentVars.length < initialLength) {
      await writeDB(db);
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Environment variable not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting environment variable', error });
  }
});

export default router;

