#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

// Database operations
async function readDB() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
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
    // Ensure data directory exists
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing database:', error);
    throw error;
  }
}

function generateId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

class ComponentsServer {
  constructor() {
    this.server = new Server(
      {
        name: 'components-mcp',
        version: '1.0.5',
      },
      {
        capabilities: {
          resources: {},
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupResourceHandlers();
    
    // Error handling
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  setupResourceHandlers() {
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      const db = await readDB();
      const resources = [];

      // Add summary resources for each entity type
      Object.keys(db).forEach(entityType => {
        resources.push({
          uri: `components-mcp://${entityType}`,
          name: `${entityType.charAt(0).toUpperCase() + entityType.slice(1)} List`,
          description: `List of all ${entityType}`,
          mimeType: 'application/json',
        });
      });

      return {
        resources,
      };
    });

    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;
      const match = uri.match(/^components-mcp:\/\/(.+)/);
      
      if (!match) {
        throw new McpError(ErrorCode.InvalidRequest, `Invalid resource URI: ${uri}`);
      }

      const entityType = match[1];
      const db = await readDB();

      if (!db[entityType]) {
        throw new McpError(ErrorCode.InvalidRequest, `Unknown entity type: ${entityType}`);
      }

      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(db[entityType], null, 2),
          },
        ],
      };
    });
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'get_components',
            description: 'Get all components or a specific component by ID',
            inputSchema: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  description: 'Optional component ID to get specific component',
                },
              },
            },
          },
          {
            name: 'create_component',
            description: 'Create a new component',
            inputSchema: {
              type: 'object',
              properties: {
                name: { type: 'string', description: 'Component name' },
                description: { type: 'string', description: 'Component description' },
                filePath: { type: 'string', description: 'Path to component file' },
                usageExample: { type: 'string', description: 'Usage example code' },
              },
              required: ['name', 'description', 'filePath'],
            },
          },
          {
            name: 'update_component',
            description: 'Update an existing component',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'string', description: 'Component ID' },
                name: { type: 'string', description: 'Component name' },
                description: { type: 'string', description: 'Component description' },
                filePath: { type: 'string', description: 'Path to component file' },
                usageExample: { type: 'string', description: 'Usage example code' },
              },
              required: ['id'],
            },
          },
          {
            name: 'delete_component',
            description: 'Delete a component',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'string', description: 'Component ID' },
              },
              required: ['id'],
            },
          },
          {
            name: 'get_apis',
            description: 'Get all APIs or a specific API by ID',
            inputSchema: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  description: 'Optional API ID to get specific API',
                },
              },
            },
          },
          {
            name: 'create_api',
            description: 'Create a new API',
            inputSchema: {
              type: 'object',
              properties: {
                name: { type: 'string', description: 'API name' },
                endpoint: { type: 'string', description: 'API endpoint path' },
                method: { 
                  type: 'string', 
                  enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
                  description: 'HTTP method' 
                },
                description: { type: 'string', description: 'API description' },
                requestBody: { type: 'object', description: 'Request body structure' },
                responseBody: { type: 'object', description: 'Response body structure' },
              },
              required: ['name', 'endpoint', 'method', 'description'],
            },
          },
          {
            name: 'update_api',
            description: 'Update an existing API',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'string', description: 'API ID' },
                name: { type: 'string', description: 'API name' },
                endpoint: { type: 'string', description: 'API endpoint path' },
                method: { 
                  type: 'string', 
                  enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
                  description: 'HTTP method' 
                },
                description: { type: 'string', description: 'API description' },
                requestBody: { type: 'object', description: 'Request body structure' },
                responseBody: { type: 'object', description: 'Response body structure' },
              },
              required: ['id'],
            },
          },
          {
            name: 'delete_api',
            description: 'Delete an API',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'string', description: 'API ID' },
              },
              required: ['id'],
            },
          },
          {
            name: 'get_environment',
            description: 'Get all environment variables or a specific one by ID',
            inputSchema: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  description: 'Optional environment variable ID to get specific variable',
                },
              },
            },
          },
          {
            name: 'create_environment',
            description: 'Create a new environment variable',
            inputSchema: {
              type: 'object',
              properties: {
                name: { type: 'string', description: 'Environment variable name' },
                description: { type: 'string', description: 'Variable description' },
                isPublic: { type: 'boolean', description: 'Whether variable is public' },
              },
              required: ['name', 'description', 'isPublic'],
            },
          },
          {
            name: 'get_style_guide',
            description: 'Get all style guide patterns or a specific one by ID',
            inputSchema: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  description: 'Optional style guide pattern ID',
                },
              },
            },
          },
          {
            name: 'create_style_guide',
            description: 'Create a new style guide pattern',
            inputSchema: {
              type: 'object',
              properties: {
                element: { type: 'string', description: 'UI element name' },
                description: { type: 'string', description: 'Pattern description' },
                className: { type: 'string', description: 'CSS class name' },
                usageExample: { type: 'string', description: 'Usage example' },
              },
              required: ['element', 'description', 'className'],
            },
          },
          {
            name: 'get_state',
            description: 'Get all state management configurations',
            inputSchema: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  description: 'Optional state management ID',
                },
              },
            },
          },
          {
            name: 'get_hooks',
            description: 'Get all custom hooks',
            inputSchema: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  description: 'Optional hook ID',
                },
              },
            },
          },
          {
            name: 'get_conventions',
            description: 'Get all coding conventions',
            inputSchema: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  description: 'Optional convention ID',
                },
              },
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        const db = await readDB();

        switch (name) {
          case 'get_components':
            if (args.id) {
              const component = db.components.find(c => c.id === args.id);
              if (!component) {
                throw new McpError(ErrorCode.InvalidRequest, 'Component not found');
              }
              return { content: [{ type: 'text', text: JSON.stringify(component, null, 2) }] };
            }
            return { 
              content: [{ 
                type: 'text', 
                text: JSON.stringify(db.components.map(({ id, name, description }) => ({
                  id, name, description
                })), null, 2) 
              }] 
            };

          case 'create_component':
            const newComponent = {
              id: generateId(),
              ...args
            };
            db.components.push(newComponent);
            await writeDB(db);
            return { content: [{ type: 'text', text: `Component created: ${JSON.stringify(newComponent, null, 2)}` }] };

          case 'update_component':
            const componentIndex = db.components.findIndex(c => c.id === args.id);
            if (componentIndex === -1) {
              throw new McpError(ErrorCode.InvalidRequest, 'Component not found');
            }
            db.components[componentIndex] = { ...db.components[componentIndex], ...args };
            await writeDB(db);
            return { content: [{ type: 'text', text: `Component updated: ${JSON.stringify(db.components[componentIndex], null, 2)}` }] };

          case 'delete_component':
            const deleteIndex = db.components.findIndex(c => c.id === args.id);
            if (deleteIndex === -1) {
              throw new McpError(ErrorCode.InvalidRequest, 'Component not found');
            }
            db.components.splice(deleteIndex, 1);
            await writeDB(db);
            return { content: [{ type: 'text', text: 'Component deleted successfully' }] };

          case 'get_apis':
            if (args.id) {
              const api = db.apis.find(a => a.id === args.id);
              if (!api) {
                throw new McpError(ErrorCode.InvalidRequest, 'API not found');
              }
              return { content: [{ type: 'text', text: JSON.stringify(api, null, 2) }] };
            }
            return { 
              content: [{ 
                type: 'text', 
                text: JSON.stringify(db.apis.map(({ id, name, description, endpoint, method }) => ({
                  id, name, description, endpoint, method
                })), null, 2) 
              }] 
            };

          case 'create_api':
            const newApi = {
              id: generateId(),
              ...args
            };
            db.apis.push(newApi);
            await writeDB(db);
            return { content: [{ type: 'text', text: `API created: ${JSON.stringify(newApi, null, 2)}` }] };

          case 'update_api':
            const apiIndex = db.apis.findIndex(a => a.id === args.id);
            if (apiIndex === -1) {
              throw new McpError(ErrorCode.InvalidRequest, 'API not found');
            }
            db.apis[apiIndex] = { ...db.apis[apiIndex], ...args };
            await writeDB(db);
            return { content: [{ type: 'text', text: `API updated: ${JSON.stringify(db.apis[apiIndex], null, 2)}` }] };

          case 'delete_api':
            const apiDeleteIndex = db.apis.findIndex(a => a.id === args.id);
            if (apiDeleteIndex === -1) {
              throw new McpError(ErrorCode.InvalidRequest, 'API not found');
            }
            db.apis.splice(apiDeleteIndex, 1);
            await writeDB(db);
            return { content: [{ type: 'text', text: 'API deleted successfully' }] };

          case 'get_environment':
            if (args.id) {
              const env = db.environment.find(e => e.id === args.id);
              if (!env) {
                throw new McpError(ErrorCode.InvalidRequest, 'Environment variable not found');
              }
              return { content: [{ type: 'text', text: JSON.stringify(env, null, 2) }] };
            }
            return { content: [{ type: 'text', text: JSON.stringify(db.environment, null, 2) }] };

          case 'create_environment':
            const newEnv = {
              id: generateId(),
              ...args
            };
            db.environment.push(newEnv);
            await writeDB(db);
            return { content: [{ type: 'text', text: `Environment variable created: ${JSON.stringify(newEnv, null, 2)}` }] };

          case 'get_style_guide':
            if (args.id) {
              const pattern = db['style-guide'].find(p => p.id === args.id);
              if (!pattern) {
                throw new McpError(ErrorCode.InvalidRequest, 'Style guide pattern not found');
              }
              return { content: [{ type: 'text', text: JSON.stringify(pattern, null, 2) }] };
            }
            return { content: [{ type: 'text', text: JSON.stringify(db['style-guide'], null, 2) }] };

          case 'create_style_guide':
            const newPattern = {
              id: generateId(),
              ...args
            };
            db['style-guide'].push(newPattern);
            await writeDB(db);
            return { content: [{ type: 'text', text: `Style guide pattern created: ${JSON.stringify(newPattern, null, 2)}` }] };

          case 'get_state':
            if (args.id) {
              const state = db.state.find(s => s.id === args.id);
              if (!state) {
                throw new McpError(ErrorCode.InvalidRequest, 'State management not found');
              }
              return { content: [{ type: 'text', text: JSON.stringify(state, null, 2) }] };
            }
            return { content: [{ type: 'text', text: JSON.stringify(db.state, null, 2) }] };

          case 'get_hooks':
            if (args.id) {
              const hook = db.hooks.find(h => h.id === args.id);
              if (!hook) {
                throw new McpError(ErrorCode.InvalidRequest, 'Hook not found');
              }
              return { content: [{ type: 'text', text: JSON.stringify(hook, null, 2) }] };
            }
            return { content: [{ type: 'text', text: JSON.stringify(db.hooks, null, 2) }] };

          case 'get_conventions':
            if (args.id) {
              const convention = db.conventions.find(c => c.id === args.id);
              if (!convention) {
                throw new McpError(ErrorCode.InvalidRequest, 'Convention not found');
              }
              return { content: [{ type: 'text', text: JSON.stringify(convention, null, 2) }] };
            }
            return { content: [{ type: 'text', text: JSON.stringify(db.conventions, null, 2) }] };

          default:
            throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
        }
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        throw new McpError(ErrorCode.InternalError, `Tool execution failed: ${error.message}`);
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Components MCP server running on stdio');
  }
}

const server = new ComponentsServer();
server.run().catch(console.error);