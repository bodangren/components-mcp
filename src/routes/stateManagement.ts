import { Router } from 'express';
import { DB, IStateManagement } from '../types';
import { readDB, writeDB } from '../utils';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: State Management
 *   description: API for managing state management configurations
 */

/**
 * @swagger
 * /state:
 *   get:
 *     summary: Get all state management configurations
 *     tags: [State Management]
 *     responses:
 *       200:
 *         description: A list of state management configurations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/IStateManagement'
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
  try {
    const db: DB = await readDB();
    const simplifiedStateManagement = db.stateManagement.map(({ id, library }) => ({ id, library }));
    res.json(simplifiedStateManagement);
  } catch (error) {
    res.status(500).json({ message: 'Error reading state management configurations', error });
  }
});

/**
 * @swagger
 * /state:
 *   post:
 *     summary: Add a new state management configuration
 *     tags: [State Management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IStateManagement'
 *     responses:
 *       201:
 *         description: The created state management configuration
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IStateManagement'
 *       500:
 *         description: Server error
 */
router.post('/', async (req, res) => {
  try {
    const newStateManagement: IStateManagement = req.body;
    const db: DB = await readDB();
    db.stateManagement.push(newStateManagement);
    await writeDB(db);
    res.status(201).json(newStateManagement);
  } catch (error) {
    res.status(500).json({ message: 'Error adding state management configuration', error });
  }
});

/**
 * @swagger
 * /state/{id}:
 *   put:
 *     summary: Update a state management configuration by ID
 *     tags: [State Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The state management configuration ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IStateManagement'
 *     responses:
 *       200:
 *         description: The updated state management configuration
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IStateManagement'
 *       404:
 *         description: State management configuration not found
 *       500:
 *         description: Server error
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedStateManagement: IStateManagement = req.body;
    const db: DB = await readDB();
    const index = db.stateManagement.findIndex(sm => sm.id === id);
    if (index !== -1) {
      db.stateManagement[index] = updatedStateManagement;
      await writeDB(db);
      res.json(updatedStateManagement);
    } else {
      res.status(404).json({ message: 'State management configuration not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating state management configuration', error });
  }
});

/**
 * @swagger
 * /state/{id}:
 *   delete:
 *     summary: Delete a state management configuration by ID
 *     tags: [State Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The state management configuration ID
 *     responses:
 *       204:
 *         description: State management configuration deleted successfully
 *       404:
 *         description: State management configuration not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db: DB = await readDB();
    const initialLength = db.stateManagement.length;
    db.stateManagement = db.stateManagement.filter(sm => sm.id !== id);
    if (db.stateManagement.length < initialLength) {
      await writeDB(db);
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'State management configuration not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting state management configuration', error });
  }
});

export default router;

