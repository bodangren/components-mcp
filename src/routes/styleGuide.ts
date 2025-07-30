import { Router } from 'express';
import { DB, IStyleGuide } from '../types';
import { readDB, writeDB } from '../utils';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: StyleGuide
 *   description: API for managing style guide configurations
 */

/**
 * @swagger
 * /style-guide:
 *   get:
 *     summary: Get all style guide configurations
 *     tags: [StyleGuide]
 *     responses:
 *       200:
 *         description: A list of style guide configurations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/IStyleGuide'
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
  try {
    const db: DB = await readDB();
    const simplifiedStyleGuide = db.styleGuide.map(({ id, element, description }) => ({ id, element, description }));
    res.json(simplifiedStyleGuide);
  } catch (error) {
    res.status(500).json({ message: 'Error reading style guide configurations', error });
  }
});

/**
 * @swagger
 * /style-guide/{id}:
 *   get:
 *     summary: Get a style guide configuration by ID
 *     tags: [StyleGuide]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The style guide configuration ID
 *     responses:
 *       200:
 *         description: The style guide configuration
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IStyleGuide'
 *       404:
 *         description: Style guide configuration not found
 *       500:
 *         description: Server error
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db: DB = await readDB();
    const styleGuideEntry = db.styleGuide.find(style => style.id === id);
    if (styleGuideEntry) {
      res.json(styleGuideEntry);
    } else {
      res.status(404).json({ message: 'Style guide configuration not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error reading style guide configuration', error });
  }
});

/**
 * @swagger
 * /style-guide:
 *   post:
 *     summary: Add a new style guide configuration
 *     tags: [StyleGuide]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IStyleGuide'
 *     responses:
 *       201:
 *         description: The created style guide configuration
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IStyleGuide'
 *       500:
 *         description: Server error
 */
router.post('/', async (req, res) => {
  try {
    const newStyleGuide: IStyleGuide = req.body;
    const db: DB = await readDB();
    db.styleGuide.push(newStyleGuide);
    await writeDB(db);
    res.status(201).json(newStyleGuide);
  } catch (error) {
    res.status(500).json({ message: 'Error adding style guide configuration', error });
  }
});

/**
 * @swagger
 * /style-guide/{id}:
 *   put:
 *     summary: Update a style guide configuration by ID
 *     tags: [StyleGuide]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The style guide configuration ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IStyleGuide'
 *     responses:
 *       200:
 *         description: The updated style guide configuration
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IStyleGuide'
 *       404:
 *         description: Style guide configuration not found
 *       500:
 *         description: Server error
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedStyleGuide: IStyleGuide = req.body;
    const db: DB = await readDB();
    const index = db.styleGuide.findIndex(style => style.id === id);
    if (index !== -1) {
      db.styleGuide[index] = updatedStyleGuide;
      await writeDB(db);
      res.json(updatedStyleGuide);
    } else {
      res.status(404).json({ message: 'Style guide configuration not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating style guide configuration', error });
  }
});

/**
 * @swagger
 * /style-guide/{id}:
 *   delete:
 *     summary: Delete a style guide configuration by ID
 *     tags: [StyleGuide]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The style guide configuration ID
 *     responses:
 *       204:
 *         description: Style guide configuration deleted successfully
 *       404:
 *         description: Style guide configuration not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db: DB = await readDB();
    const initialLength = db.styleGuide.length;
    db.styleGuide = db.styleGuide.filter(style => style.id !== id);
    if (db.styleGuide.length < initialLength) {
      await writeDB(db);
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Style guide configuration not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting style guide configuration', error });
  }
});

export default router;

