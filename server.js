const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'data', 'db.json');

app.use(cors());
app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Components MCP API',
      version: '1.0.5',
      description: 'Master Control Program server for managing project components, APIs, and coding standards',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./server.js'],
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

async function readDB() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return {
      components: [],
      apis: [],
      environment: [],
      'style-guide': [],
      state: [],
      hooks: [],
      conventions: []
    };
  }
}

async function writeDB(data) {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing database:', error);
    throw error;
  }
}

function generateId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

/**
 * @swagger
 * /:
 *   get:
 *     summary: Welcome message and endpoint summary
 *     responses:
 *       200:
 *         description: Welcome message with available endpoints
 */
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Components MCP API',
    version: '1.0.5',
    endpoints: {
      components: '/components',
      apis: '/apis',
      environment: '/environment',
      styleGuide: '/style-guide',
      state: '/state',
      hooks: '/hooks',
      conventions: '/conventions',
      documentation: '/api-docs'
    }
  });
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Component:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - filePath
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier
 *         name:
 *           type: string
 *           description: Component name
 *         description:
 *           type: string
 *           description: Component description
 *         filePath:
 *           type: string
 *           description: Path to component file
 *         usageExample:
 *           type: string
 *           description: Usage example code
 *     Api:
 *       type: object
 *       required:
 *         - name
 *         - endpoint
 *         - method
 *         - description
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier
 *         name:
 *           type: string
 *           description: API name
 *         endpoint:
 *           type: string
 *           description: API endpoint path
 *         method:
 *           type: string
 *           enum: [GET, POST, PUT, DELETE, PATCH]
 *           description: HTTP method
 *         description:
 *           type: string
 *           description: API description
 *         requestBody:
 *           type: object
 *           description: Request body structure
 *         responseBody:
 *           type: object
 *           description: Response body structure
 *     StyleGuidePattern:
 *       type: object
 *       required:
 *         - element
 *         - description
 *         - className
 *       properties:
 *         id:
 *           type: string
 *         element:
 *           type: string
 *         description:
 *           type: string
 *         className:
 *           type: string
 *         usageExample:
 *           type: string
 *     EnvironmentVariable:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - isPublic
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         isPublic:
 *           type: boolean
 *     StateManagement:
 *       type: object
 *       required:
 *         - library
 *         - storeDirectory
 *         - usagePattern
 *       properties:
 *         id:
 *           type: string
 *         library:
 *           type: string
 *         storeDirectory:
 *           type: string
 *         usagePattern:
 *           type: string
 *     CustomHook:
 *       type: object
 *       required:
 *         - name
 *         - filePath
 *         - description
 *         - usage
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         filePath:
 *           type: string
 *         description:
 *           type: string
 *         usage:
 *           type: string
 *     Convention:
 *       type: object
 *       required:
 *         - rule
 *         - description
 *       properties:
 *         id:
 *           type: string
 *         rule:
 *           type: string
 *         description:
 *           type: string
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message
 *     Success:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Success message
 */

function createCRUDRoutes(entityName, entityKey) {
  const capitalizedEntity = entityName.charAt(0).toUpperCase() + entityName.slice(1);
  const schemaName = entityKey === 'components' ? 'Component' :
                     entityKey === 'apis' ? 'Api' :
                     entityKey === 'style-guide' ? 'StyleGuidePattern' :
                     entityKey === 'environment' ? 'EnvironmentVariable' :
                     entityKey === 'state' ? 'StateManagement' :
                     entityKey === 'hooks' ? 'CustomHook' :
                     entityKey === 'conventions' ? 'Convention' : 'Object';

  app.get(`/${entityName}`, async (req, res) => {
    try {
      const db = await readDB();
      const entities = db[entityKey] || [];
      
      if (entityKey === 'components') {
        const summary = entities.map(({ id, name, description }) => ({
          id, name, description
        }));
        res.json(summary);
      } else if (entityKey === 'apis') {
        const summary = entities.map(({ id, name, description }) => ({
          id, name, description
        }));
        res.json(summary);
      } else {
        res.json(entities);
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get(`/${entityName}/:id`, async (req, res) => {
    try {
      const db = await readDB();
      const entities = db[entityKey] || [];
      const entity = entities.find(item => item.id === req.params.id);
      
      if (!entity) {
        return res.status(404).json({ error: `${entityName} not found` });
      }
      
      res.json(entity);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post(`/${entityName}`, async (req, res) => {
    try {
      const db = await readDB();
      const entities = db[entityKey] || [];
      
      const newEntity = {
        id: generateId(),
        ...req.body
      };
      
      entities.push(newEntity);
      db[entityKey] = entities;
      
      await writeDB(db);
      res.status(201).json(newEntity);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.put(`/${entityName}/:id`, async (req, res) => {
    try {
      const db = await readDB();
      const entities = db[entityKey] || [];
      const index = entities.findIndex(item => item.id === req.params.id);
      
      if (index === -1) {
        return res.status(404).json({ error: `${entityName} not found` });
      }
      
      entities[index] = { ...entities[index], ...req.body, id: req.params.id };
      await writeDB(db);
      res.json(entities[index]);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.delete(`/${entityName}/:id`, async (req, res) => {
    try {
      const db = await readDB();
      const entities = db[entityKey] || [];
      const index = entities.findIndex(item => item.id === req.params.id);
      
      if (index === -1) {
        return res.status(404).json({ error: `${entityName} not found` });
      }
      
      entities.splice(index, 1);
      db[entityKey] = entities;
      
      await writeDB(db);
      res.json({ message: `${entityName} deleted successfully` });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
}

// Components endpoints
/**
 * @swagger
 * /components:
 *   get:
 *     summary: Get all components
 *     description: Retrieve a list of all components
 *     tags: [Components]
 *     responses:
 *       200:
 *         description: List of components
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Component'
 *   post:
 *     summary: Create a component
 *     description: Create a new component
 *     tags: [Components]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Component'
 *     responses:
 *       201:
 *         description: Component created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Component'
 * /components/{id}:
 *   get:
 *     summary: Get component by ID
 *     tags: [Components]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Component details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Component'
 *       404:
 *         description: Component not found
 *   put:
 *     summary: Update component
 *     tags: [Components]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Component'
 *     responses:
 *       200:
 *         description: Component updated
 *   delete:
 *     summary: Delete component
 *     tags: [Components]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Component deleted
 */

/**
 * @swagger
 * /apis:
 *   get:
 *     summary: Get all APIs
 *     tags: [APIs]
 *     responses:
 *       200:
 *         description: List of APIs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Api'
 *   post:
 *     summary: Create an API
 *     tags: [APIs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Api'
 *     responses:
 *       201:
 *         description: API created
 * /apis/{id}:
 *   get:
 *     summary: Get API by ID
 *     tags: [APIs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: API details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Api'
 *   put:
 *     summary: Update API
 *     tags: [APIs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Api'
 *     responses:
 *       200:
 *         description: API updated
 *   delete:
 *     summary: Delete API
 *     tags: [APIs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: API deleted
 */

/**
 * @swagger
 * /environment:
 *   get:
 *     summary: Get all environment variables
 *     tags: [Environment]
 *     responses:
 *       200:
 *         description: List of environment variables
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EnvironmentVariable'
 *   post:
 *     summary: Create environment variable
 *     tags: [Environment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EnvironmentVariable'
 *     responses:
 *       201:
 *         description: Environment variable created
 * /environment/{id}:
 *   get:
 *     summary: Get environment variable by ID
 *     tags: [Environment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Environment variable details
 *   put:
 *     summary: Update environment variable
 *     tags: [Environment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Environment variable updated
 *   delete:
 *     summary: Delete environment variable
 *     tags: [Environment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Environment variable deleted
 */

/**
 * @swagger
 * /style-guide:
 *   get:
 *     summary: Get all style guide patterns
 *     tags: [Style Guide]
 *     responses:
 *       200:
 *         description: List of style guide patterns
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StyleGuidePattern'
 *   post:
 *     summary: Create style guide pattern
 *     tags: [Style Guide]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StyleGuidePattern'
 *     responses:
 *       201:
 *         description: Style guide pattern created
 * /style-guide/{id}:
 *   get:
 *     summary: Get style guide pattern by ID
 *     tags: [Style Guide]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Style guide pattern details
 *   put:
 *     summary: Update style guide pattern
 *     tags: [Style Guide]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Style guide pattern updated
 *   delete:
 *     summary: Delete style guide pattern
 *     tags: [Style Guide]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Style guide pattern deleted
 */

/**
 * @swagger
 * /state:
 *   get:
 *     summary: Get all state management configurations
 *     tags: [State Management]
 *     responses:
 *       200:
 *         description: List of state management configurations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StateManagement'
 *   post:
 *     summary: Create state management configuration
 *     tags: [State Management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StateManagement'
 *     responses:
 *       201:
 *         description: State management configuration created
 * /state/{id}:
 *   get:
 *     summary: Get state management configuration by ID
 *     tags: [State Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: State management configuration details
 *   put:
 *     summary: Update state management configuration
 *     tags: [State Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: State management configuration updated
 *   delete:
 *     summary: Delete state management configuration
 *     tags: [State Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: State management configuration deleted
 */

/**
 * @swagger
 * /hooks:
 *   get:
 *     summary: Get all custom hooks
 *     tags: [Custom Hooks]
 *     responses:
 *       200:
 *         description: List of custom hooks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CustomHook'
 *   post:
 *     summary: Create custom hook
 *     tags: [Custom Hooks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CustomHook'
 *     responses:
 *       201:
 *         description: Custom hook created
 * /hooks/{id}:
 *   get:
 *     summary: Get custom hook by ID
 *     tags: [Custom Hooks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Custom hook details
 *   put:
 *     summary: Update custom hook
 *     tags: [Custom Hooks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Custom hook updated
 *   delete:
 *     summary: Delete custom hook
 *     tags: [Custom Hooks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Custom hook deleted
 */

/**
 * @swagger
 * /conventions:
 *   get:
 *     summary: Get all code conventions
 *     tags: [Code Conventions]
 *     responses:
 *       200:
 *         description: List of code conventions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Convention'
 *   post:
 *     summary: Create code convention
 *     tags: [Code Conventions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Convention'
 *     responses:
 *       201:
 *         description: Code convention created
 * /conventions/{id}:
 *   get:
 *     summary: Get code convention by ID
 *     tags: [Code Conventions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Code convention details
 *   put:
 *     summary: Update code convention
 *     tags: [Code Conventions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Code convention updated
 *   delete:
 *     summary: Delete code convention
 *     tags: [Code Conventions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Code convention deleted
 */

createCRUDRoutes('components', 'components');
createCRUDRoutes('apis', 'apis');
createCRUDRoutes('environment', 'environment');
createCRUDRoutes('style-guide', 'style-guide');
createCRUDRoutes('state', 'state');
createCRUDRoutes('hooks', 'hooks');
createCRUDRoutes('conventions', 'conventions');

app.listen(PORT, () => {
  console.log(`MCP Server running on http://localhost:${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
});

module.exports = app;