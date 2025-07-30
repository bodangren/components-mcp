import { Router } from 'express';
import { DB, ICodeConvention } from '../types';
import { readDB, writeDB } from '../utils';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Code Conventions
 *   description: API for managing code conventions
 */

/**
 * @swagger
 * /conventions:
 *   get:
 *     summary: Get all code conventions
 *     tags: [Code Conventions]
 *     responses:
 *       200:
 *         description: A list of code conventions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ICodeConvention'
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
  try {
    const db: DB = await readDB();
    res.json(db.codeConventions);
  } catch (error) {
    res.status(500).json({ message: 'Error reading code conventions', error });
  }
});

/**
 * @swagger
 * /conventions:
 *   post:
 *     summary: Add a new code convention
 *     tags: [Code Conventions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ICodeConvention'
 *     responses:
 *       201:
 *         description: The created code convention
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ICodeConvention'
 *       500:
 *         description: Server error
 */
router.post('/', async (req, res) => {
  try {
    const newCodeConvention: ICodeConvention = req.body;
    const db: DB = await readDB();
    db.codeConventions.push(newCodeConvention);
    await writeDB(db);
    res.status(201).json(newCodeConvention);
  } catch (error) {
    res.status(500).json({ message: 'Error adding code convention', error });
  }
});

/**
 * @swagger
 * /conventions/{id}:
 *   put:
 *     summary: Update a code convention by ID
 *     tags: [Code Conventions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The code convention ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ICodeConvention'
 *     responses:
 *       200:
 *         description: The updated code convention
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ICodeConvention'
 *       404:
 *         description: Code convention not found
 *       500:
 *         description: Server error
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCodeConvention: ICodeConvention = req.body;
    const db: DB = await readDB();
    const index = db.codeConventions.findIndex(conv => conv.id === id);
    if (index !== -1) {
      db.codeConventions[index] = updatedCodeConvention;
      await writeDB(db);
      res.json(updatedCodeConvention);
    } else {
      res.status(404).json({ message: 'Code convention not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating code convention', error });
  }
});

/**
 * @swagger
 * /conventions/{id}:
 *   delete:
 *     summary: Delete a code convention by ID
 *     tags: [Code Conventions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The code convention ID
 *     responses:
 *       204:
 *         description: Code convention deleted successfully
 *       404:
 *         description: Code convention not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db: DB = await readDB();
    const initialLength = db.codeConventions.length;
    db.codeConventions = db.codeConventions.filter(conv => conv.id !== id);
    if (db.codeConventions.length < initialLength) {
      await writeDB(db);
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Code convention not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting code convention', error });
  }
});

export default router;

