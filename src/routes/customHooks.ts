import { Router } from 'express';
import { DB, ICustomHook } from '../types';
import { readDB, writeDB } from '../utils';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Custom Hooks
 *   description: API for managing custom hooks
 */

/**
 * @swagger
 * /hooks:
 *   get:
 *     summary: Get all custom hooks
 *     tags: [Custom Hooks]
 *     responses:
 *       200:
 *         description: A list of custom hooks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ICustomHook'
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
  try {
    const db: DB = await readDB();
    const simplifiedHooks = db.customHooks.map(({ id, name }) => ({ id, name }));
    res.json(simplifiedHooks);
  } catch (error) {
    res.status(500).json({ message: 'Error reading custom hooks', error });
  }
});

/**
 * @swagger
 * /hooks:
 *   post:
 *     summary: Add a new custom hook
 *     tags: [Custom Hooks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ICustomHook'
 *     responses:
 *       201:
 *         description: The created custom hook
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ICustomHook'
 *       500:
 *         description: Server error
 */
router.post('/', async (req, res) => {
  try {
    const newCustomHook: ICustomHook = req.body;
    const db: DB = await readDB();
    db.customHooks.push(newCustomHook);
    await writeDB(db);
    res.status(201).json(newCustomHook);
  } catch (error) {
    res.status(500).json({ message: 'Error adding custom hook', error });
  }
});

/**
 * @swagger
 * /hooks/{id}:
 *   put:
 *     summary: Update a custom hook by ID
 *     tags: [Custom Hooks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The custom hook ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ICustomHook'
 *     responses:
 *       200:
 *         description: The updated custom hook
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ICustomHook'
 *       404:
 *         description: Custom hook not found
 *       500:
 *         description: Server error
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCustomHook: ICustomHook = req.body;
    const db: DB = await readDB();
    const index = db.customHooks.findIndex(hook => hook.id === id);
    if (index !== -1) {
      db.customHooks[index] = updatedCustomHook;
      await writeDB(db);
      res.json(updatedCustomHook);
    } else {
      res.status(404).json({ message: 'Custom hook not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating custom hook', error });
  }
});

/**
 * @swagger
 * /hooks/{id}:
 *   delete:
 *     summary: Delete a custom hook by ID
 *     tags: [Custom Hooks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The custom hook ID
 *     responses:
 *       204:
 *         description: Custom hook deleted successfully
 *       404:
 *         description: Custom hook not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db: DB = await readDB();
    const initialLength = db.customHooks.length;
    db.customHooks = db.customHooks.filter(hook => hook.id !== id);
    if (db.customHooks.length < initialLength) {
      await writeDB(db);
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Custom hook not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting custom hook', error });
  }
});

export default router;

