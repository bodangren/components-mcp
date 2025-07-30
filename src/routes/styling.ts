import { Router } from 'express';
import { DB, IStyling } from '../types';
import { readDB, writeDB } from '../utils';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Styling
 *   description: API for managing styling configurations
 */

/**
 * @swagger
 * /styling:
 *   get:
 *     summary: Get all styling configurations
 *     tags: [Styling]
 *     responses:
 *       200:
 *         description: A list of styling configurations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/IStyling'
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
  try {
    const db: DB = await readDB();
    res.json(db.styling);
  } catch (error) {
    res.status(500).json({ message: 'Error reading styling configurations', error });
  }
});

/**
 * @swagger
 * /styling:
 *   post:
 *     summary: Add a new styling configuration
 *     tags: [Styling]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IStyling'
 *     responses:
 *       201:
 *         description: The created styling configuration
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IStyling'
 *       500:
 *         description: Server error
 */
router.post('/', async (req, res) => {
  try {
    const newStyling: IStyling = req.body;
    const db: DB = await readDB();
    db.styling.push(newStyling);
    await writeDB(db);
    res.status(201).json(newStyling);
  } catch (error) {
    res.status(500).json({ message: 'Error adding styling configuration', error });
  }
});

/**
 * @swagger
 * /styling/{id}:
 *   put:
 *     summary: Update a styling configuration by ID
 *     tags: [Styling]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The styling configuration ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IStyling'
 *     responses:
 *       200:
 *         description: The updated styling configuration
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IStyling'
 *       404:
 *         description: Styling configuration not found
 *       500:
 *         description: Server error
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedStyling: IStyling = req.body;
    const db: DB = await readDB();
    const index = db.styling.findIndex(style => style.id === id);
    if (index !== -1) {
      db.styling[index] = updatedStyling;
      await writeDB(db);
      res.json(updatedStyling);
    } else {
      res.status(404).json({ message: 'Styling configuration not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating styling configuration', error });
  }
});

/**
 * @swagger
 * /styling/{id}:
 *   delete:
 *     summary: Delete a styling configuration by ID
 *     tags: [Styling]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The styling configuration ID
 *     responses:
 *       204:
 *         description: Styling configuration deleted successfully
 *       404:
 *         description: Styling configuration not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db: DB = await readDB();
    const initialLength = db.styling.length;
    db.styling = db.styling.filter(style => style.id !== id);
    if (db.styling.length < initialLength) {
      await writeDB(db);
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Styling configuration not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting styling configuration', error });
  }
});

export default router;

