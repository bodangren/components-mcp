import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { Component, DB } from '../types';

/**
 * @swagger
 * components:
 *   schemas:
 *     Component:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - description
 *         - snippet
 *         - category
 *         - dependencies
 *         - usage
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the component
 *         name:
 *           type: string
 *           description: The name of the component
 *         description:
 *           type: string
 *           description: The description of the component
 *         snippet:
 *           type: string
 *           description: Filesystem location of the component
 *         category:
 *           type: string
 *           description: The category of the component
 *         dependencies:
 *           type: array
 *           items:
 *             type: string
 *           description: List of dependencies for the component
 *         usage:
 *           type: string
 *           description: Instructions on how to use the component
 *       example:
 *         id: button
 *         name: Button
 *         description: A simple button component.
 *         snippet: <button>Click me</button>
 *         category: UI
 *         dependencies: []
 *         usage: <Button>Click me</Button>
 *     ComponentSummary:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the component
 *         name:
 *           type: string
 *           description: The name of the component
 *         description:
 *           type: string
 *           description: The description of the component
 *         category:
 *           type: string
 *           description: The category of the component
 *       example:
 *         id: button
 *         name: Button
 *         description: A simple button component.
 *         category: UI
 *     ComponentInput:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - snippet
 *         - category
 *         - dependencies
 *         - usage
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the component
 *         description:
 *           type: string
 *           description: The description of the component
 *         snippet:
 *           type: string
 *           description: Filesystem location of the component
 *         category:
 *           type: string
 *           description: The category of the component
 *         dependencies:
 *           type: array
 *           items:
 *             type: string
 *           description: List of dependencies for the component
 *         usage:
 *           type: string
 *           description: Instructions on how to use the component
 *       example:
 *         name: Card
 *         description: A flexible content container.
 *         snippet: <div>Card Content</div>
 *         category: Layout
 *         dependencies: []
 *         usage: <Card title="My Card">Content</Card>
 */

const router = Router();
const dbPath = path.resolve(__dirname, '../../data/db.json');

import { v4 as uuidv4 } from 'uuid';

const readData = (): DB => {
  const data = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(data);
};

const writeData = (data: DB) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

/**
 * @swagger
 * /components:
 *   get:
 *     summary: Retrieve a list of components
 *     tags: [Components]
 *     responses:
 *       200:
 *         description: A list of components.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ComponentSummary'
 */
router.get('/', (req: Request, res: Response) => {
  const data = readData();
  const simplifiedComponents = data.components.map(({ id, name, description, category }) => ({
    id,
    name,
    description,
    category,
  }));
  res.json(simplifiedComponents);
});

/**
 * @swagger
 * /components/{id}:
 *   get:
 *     summary: Retrieve a single component by ID
 *     tags: [Components]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the component to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single component object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Component'
 *       404:
 *         description: Component not found
 */
router.get('/:id', (req: Request, res: Response) => {
  const data = readData();
  const component = data.components.find(c => c.id === req.params.id);
  if (component) {
    res.json(component);
  } else {
    res.status(404).send('Component not found');
  }
});

/**
 * @swagger
 * /components:
 *   post:
 *     summary: Create a new component
 *     tags: [Components]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ComponentInput'
 *     responses:
 *       201:
 *         description: The created component object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Component'
 *       400:
 *         description: Missing required fields
 */
router.post('/', (req: Request, res: Response) => {
  const { name, description, snippet, category, dependencies, usage } = req.body;

  if (!name || !description || !snippet || !category || !dependencies || !usage) {
    return res.status(400).send('Missing required fields');
  }

  const data = readData();
  const newComponent: Component = {
    id: uuidv4(),
    name,
    description,
    snippet,
    category,
    dependencies,
    usage,
  };
  data.components.push(newComponent);
  writeData(data);
  res.status(201).json(newComponent);
});

/**
 * @swagger
 * /components/{id}:
 *   put:
 *     summary: Update a component by ID
 *     tags: [Components]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the component to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ComponentInput'
 *     responses:
 *       200:
 *         description: The updated component object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Component'
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Component not found
 */
router.put('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, snippet, category, dependencies, usage } = req.body;

  if (!name || !description || !snippet || !category || !dependencies || !usage) {
    return res.status(400).send('Missing required fields');
  }

  const data = readData();
  const componentIndex = data.components.findIndex(c => c.id === id);

  if (componentIndex === -1) {
    return res.status(404).send('Component not found');
  }

  const updatedComponent: Component = {
    id,
    name,
    description,
    snippet,
    category,
    dependencies,
    usage,
  };

  data.components[componentIndex] = updatedComponent;
  writeData(data);
  res.json(updatedComponent);
});

/**
 * @swagger
 * /components/{id}:
 *   delete:
 *     summary: Delete a component by ID
 *     tags: [Components]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the component to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Component deleted successfully
 *       404:
 *         description: Component not found
 */
router.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const data = readData();
  const componentIndex = data.components.findIndex(c => c.id === id);

  if (componentIndex === -1) {
    return res.status(404).send('Component not found');
  }

  data.components.splice(componentIndex, 1);
  writeData(data);
  res.status(204).send();
});

export default router;
