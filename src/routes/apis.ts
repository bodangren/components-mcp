import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { API, DB } from '../types';

const router = Router();
const dbPath = path.resolve(__dirname, '../../data/db.json');

const readData = (): DB => {
  const data = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(data);
};

const writeData = (data: DB) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

router.get('/', (req: Request, res: Response) => {
  const data = readData();
  res.json(data.apis);
});

router.get('/:id', (req: Request, res: Response) => {
  const data = readData();
  const api = data.apis.find(a => a.id === req.params.id);
  if (api) {
    res.json(api);
  } else {
    res.status(404).send('API not found');
  }
});

router.post('/', (req: Request, res: Response) => {
  const { name, description, endpoint, method, parameters, requestBody, responseBody } = req.body;

  if (!name || !description || !endpoint || !method || !parameters || !requestBody || !responseBody) {
    return res.status(400).send('Missing required fields');
  }

  const data = readData();
  const newAPI: API = {
    id: uuidv4(),
    name,
    description,
    endpoint,
    method,
    parameters,
    requestBody,
    responseBody,
  };
  data.apis.push(newAPI);
  writeData(data);
  res.status(201).json(newAPI);
});

router.put('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, endpoint, method, parameters, requestBody, responseBody } = req.body;

  if (!name || !description || !endpoint || !method || !parameters || !requestBody || !responseBody) {
    return res.status(400).send('Missing required fields');
  }

  const data = readData();
  const apiIndex = data.apis.findIndex(a => a.id === id);

  if (apiIndex === -1) {
    return res.status(404).send('API not found');
  }

  const updatedAPI: API = {
    id,
    name,
    description,
    endpoint,
    method,
    parameters,
    requestBody,
    responseBody,
  };

  data.apis[apiIndex] = updatedAPI;
  writeData(data);
  res.json(updatedAPI);
});

router.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const data = readData();
  const apiIndex = data.apis.findIndex(a => a.id === id);

  if (apiIndex === -1) {
    return res.status(404).send('API not found');
  }

  data.apis.splice(apiIndex, 1);
  writeData(data);
  res.status(204).send();
});

export default router;
