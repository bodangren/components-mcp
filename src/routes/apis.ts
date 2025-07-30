import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { API, DB } from '../types';

/**
 * @swagger
 * components:
 *   schemas:
 *     API:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - description
 *         - endpoint
 *         - method
 *         - parameters
 *         - requestBody
 *         - responseBody
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the API
 *         name:
 *           type: string
 *           description: The name of the API
 *         description:
 *           type: string
 *           description: The description of the API
 *         endpoint:
 *           type: string
 *           description: The API endpoint URL
 *         method:
 *           type: string
 *           description: The HTTP method (e.g., GET, POST)
 *         parameters:
 *           type: string
 *           description: Description of API parameters
 *         requestBody:
 *           type: string
 *           description: Description of the request body
 *         responseBody:
 *           type: string
 *           description: Description of the response body
 *       example:
 *         id: d5fE_asz
 *         name: Get Users
 *         description: Retrieves a list of users.
 *         endpoint: /api/users
 *         method: GET
 *         parameters: None
 *         requestBody: None
 *         responseBody: Array of user objects
 *     APIInput:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - endpoint
 *         - method
 *         - parameters
 *         - requestBody
 *         - responseBody
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the API
 *         description:
 *           type: string
 *           description: The description of the API
 *         endpoint:
 *           type: string
 *           description: The API endpoint URL
 *         method:
 *           type: string
 *           description: The HTTP method (e.g., GET, POST)
 *         parameters:
 *           type: string
 *           description: Description of API parameters
 *         requestBody:
 *           type: string
 *           description: Description of the request body
 *         responseBody:
 *           type: string
 *           description: Description of the response body
 *       example:
 *         name: Create User
 *         description: Creates a new user.
 *         endpoint: /api/users
 *         method: POST
 *         parameters: User object
 *         requestBody: User data in JSON format
 *         responseBody: Created user object
 */

const router = Router();
const dbPath = path.resolve(__dirname, '../../data/db.json');

const readData = (): DB => {
  const data = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(data);
};

const writeData = (data: DB) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

/**
 * @swagger
 * /apis:
 *   get:
 *     summary: Retrieve a list of APIs
 *     tags: [APIs]
 *     responses:
 *       200:
 *         description: A list of APIs.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/API'
 */
router.get('/', (req: Request, res: Response) => {
  const data = readData();
  res.json(data.apis);
});

/**
 * @swagger
 * /apis/{id}:
 *   get:
 *     summary: Retrieve a single API by ID
 *     tags: [APIs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the API to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single API object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/API'
 *       404:
 *         description: API not found
 */
router.get('/:id', (req: Request, res: Response) => {
  const data = readData();
  const api = data.apis.find(a => a.id === req.params.id);
  if (api) {
    res.json(api);
  } else {
    res.status(404).send('API not found');
  }
});

/**
 * @swagger
 * /apis:
 *   post:
 *     summary: Create a new API
 *     tags: [APIs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/APIInput'
 *     responses:
 *       201:
 *         description: The created API object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/API'
 *       400:
 *         description: Missing required fields
 */
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

/**
 * @swagger
 * /apis/{id}:
 *   put:
 *     summary: Update an API by ID
 *     tags: [APIs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the API to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/APIInput'
 *     responses:
 *       200:
 *         description: The updated API object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/API'
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: API not found
 */
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

/**
 * @swagger
 * /apis/{id}:
 *   delete:
 *     summary: Delete an API by ID
 *     tags: [APIs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the API to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: API deleted successfully
 *       404:
 *         description: API not found
 */
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
