import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MCP Server API Documentation',
      version: '1.0.0',
      description: 'API documentation for the MCP Server',
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        IEnvironmentVar: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'The unique identifier for the environment variable',
            },
            name: {
              type: 'string',
              description: 'The name of the environment variable',
            },
            description: {
              type: 'string',
              description: 'A description of the environment variable'
            },
            isPublic: {
              type: 'boolean',
              description: 'Whether the environment variable is public or not'
            },
          },
          required: ['id', 'name', 'description', 'isPublic'],
        },
        APISummary: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'The unique identifier for the API',
            },
            name: {
              type: 'string',
              description: 'The name of the API',
            },
            description: {
              type: 'string',
              description: 'A brief description of the API',
            },
          },
          required: ['id', 'name', 'description'],
        },
        API: {
          type: 'object',
          required: [
            'id',
            'name',
            'description',
            'endpoint',
            'method',
            'parameters',
            'requestBody',
            'responseBody',
          ],
          properties: {
            id: {
              type: 'string',
              description: 'The auto-generated ID of the API',
            },
            name: {
              type: 'string',
              description: 'The name of the API',
            },
            description: {
              type: 'string',
              description: 'The description of the API',
            },
            endpoint: {
              type: 'string',
              description: 'The API endpoint URL',
            },
            method: {
              type: 'string',
              description: 'The HTTP method (e.g., GET, POST)',
            },
            parameters: {
              type: 'string',
              description: 'Description of API parameters',
            },
            requestBody: {
              type: 'string',
              description: 'Description of the request body',
            },
            responseBody: {
              type: 'string',
              description: 'Description of the response body',
            },
          },
          example: {
            id: 'd5fE_asz',
            name: 'Get Users',
            description: 'Retrieves a list of users.',
            endpoint: '/api/users',
            method: 'GET',
            parameters: 'None',
            requestBody: 'None',
            responseBody: 'Array of user objects',
          },
        },
        APIInput: {
          type: 'object',
          required: [
            'name',
            'description',
            'endpoint',
            'method',
            'parameters',
            'requestBody',
            'responseBody',
          ],
          properties: {
            name: {
              type: 'string',
              description: 'The name of the API',
            },
            description: {
              type: 'string',
              description: 'The description of the API',
            },
            endpoint: {
              type: 'string',
              description: 'The API endpoint URL',
            },
            method: {
              type: 'string',
              description: 'The HTTP method (e.g., GET, POST)',
            },
            parameters: {
              type: 'string',
              description: 'Description of API parameters',
            },
            requestBody: {
              type: 'string',
              description: 'Description of the request body',
            },
            responseBody: {
              type: 'string',
              description: 'Description of the response body',
            },
          },
          example: {
            name: 'Create User',
            description: 'Creates a new user.',
            endpoint: '/api/users',
            method: 'POST',
            parameters: 'User object',
            requestBody: 'User data in JSON format',
            responseBody: 'Created user object',
          },
        },

        IStyleGuide: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'The unique identifier for the style guide entry',
            },
            element: {
              type: 'string',
              description: 'The UI element being styled (e.g., Primary Button, Form Input with Error)',
            },
            description: {
              type: 'string',
              description: 'A description of when and how to use this style',
            },
            className: {
              type: 'string',
              description: 'The Tailwind CSS classes for this style',
            },
            usageExample: {
              type: 'string',
              description: 'An HTML usage example for this style',
            },
          },
          required: ['id', 'element', 'description', 'className', 'usageExample'],
        },

        IStateManagement: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'The unique identifier for the state management configuration',
            },
            library: {
              type: 'string',
              description: 'The state management library used (e.g., Zustand, Redux)',
            },
            storeDirectory: {
              type: 'string',
              description: 'The directory where store files are located',
            },
            usagePattern: {
              type: 'string',
              description: 'Description of state management usage patterns',
            },
          },
          required: ['id', 'library', 'storeDirectory', 'usagePattern'],
        },
        ICustomHook: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'The unique identifier for the custom hook',
            },
            name: {
              type: 'string',
              description: 'The name of the custom hook',
            },
            filePath: {
              type: 'string',
              description: 'The file path of the custom hook',
            },
            description: {
              type: 'string',
              description: 'A description of the custom hook',
            },
            usage: {
              type: 'string',
              description: 'Example usage of the custom hook',
            },
          },
          required: ['id', 'name', 'filePath', 'description', 'usage'],
        },
        ICodeConvention: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'The unique identifier for the code convention',
            },
            rule: {
              type: 'string',
              description: 'The code convention rule',
            },
            description: {
              type: 'string',
              description: 'A description of the code convention rule',
            },
          },
          required: ['id', 'rule', 'description'],
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

export default specs;
