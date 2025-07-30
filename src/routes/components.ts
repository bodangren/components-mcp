import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { Component, DB } from '../types';

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

router.get('/', (req: Request, res: Response) => {
  const data = readData();
  res.json(data.components);
});

router.get('/:id', (req: Request, res: Response) => {
  const data = readData();
  const component = data.components.find(c => c.id === req.params.id);
  if (component) {
    res.json(component);
  } else {
    res.status(404).send('Component not found');
  }
});

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
