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
        IStyling: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'The unique identifier for the styling configuration',
            },
            solution: {
              type: 'string',
              description: 'The styling solution used (e.g., Tailwind CSS, CSS Modules)',
            },
            themePath: {
              type: 'string',
              description: 'The path to the theme file',
            },
            globalStylesPath: {
              type: 'string',
              description: 'The path to the global styles file',
            },
            conventions: {
              type: 'string',
              description: 'Description of styling conventions',
            },
          },
          required: ['id', 'solution', 'themePath', 'globalStylesPath', 'conventions'],
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
