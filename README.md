# Components MCP Server

A Model Context Protocol (MCP) server for managing project components, APIs, and coding standards. This server provides tools and resources for Claude Code to interact with your project's knowledge base.

## Features

- **Component Management**: Track reusable UI components with file paths and usage examples
- **API Documentation**: Manage API endpoints with full request/response details
- **Environment Variables**: Document required environment variables
- **Style Guide**: Maintain design system patterns and CSS classes
- **State Management**: Document global state management strategies
- **Custom Hooks**: Track reusable React hooks
- **Code Conventions**: Maintain coding standards and linting rules
- **MCP Protocol**: Full Model Context Protocol implementation
- **Claude Code Integration**: Native integration with Claude Code

## Installation

### From npm (when published)
```bash
npm install -g components-mcp
```

### From source
```bash
git clone https://github.com/bodangren/components-mcp.git
cd components-mcp
npm install
```

## Usage

### As MCP Server

Add to your Claude Code project settings:

```json
{
  "mcpServers": {
    "components-mcp": {
      "type": "stdio",
      "command": "node",
      "args": ["/path/to/components-mcp/server.js"]
    }
  }
}
```

Or install globally and use:

```json
{
  "mcpServers": {
    "components-mcp": {
      "type": "stdio",
      "command": "components-mcp"
    }
  }
}
```

### Available Tools

Once configured, Claude Code will have access to these MCP tools:

#### Components
- `get_components` - List all components or get specific component by ID
- `create_component` - Create new component
- `update_component` - Update existing component
- `delete_component` - Delete component

#### APIs
- `get_apis` - List all APIs or get specific API by ID
- `create_api` - Create new API endpoint
- `update_api` - Update existing API
- `delete_api` - Delete API

#### Other Tools
- `get_environment` - Manage environment variables
- `create_environment` - Create environment variable
- `get_style_guide` - Manage style guide patterns
- `create_style_guide` - Create style guide pattern
- `get_state` - Get state management configurations
- `get_hooks` - Get custom hooks
- `get_conventions` - Get coding conventions

### Available Resources

Access project data via MCP resources:

- `components-mcp://components` - All components
- `components-mcp://apis` - All APIs
- `components-mcp://environment` - Environment variables
- `components-mcp://style-guide` - Style guide patterns
- `components-mcp://state` - State management
- `components-mcp://hooks` - Custom hooks
- `components-mcp://conventions` - Code conventions

## Data Models

### Component
```typescript
interface Component {
  id: string;
  name: string;
  description: string;
  filePath: string;
  usageExample?: string;
}
```

### API
```typescript
interface Api {
  id: string;
  name: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  description: string;
  requestBody?: object;
  responseBody?: object;
}
```

### Environment Variable
```typescript
interface EnvironmentVariable {
  id: string;
  name: string;
  description: string;
  isPublic: boolean;
}
```

### Style Guide Pattern
```typescript
interface StyleGuidePattern {
  id: string;
  element: string;
  description: string;
  className: string;
  usageExample?: string;
}
```

### State Management
```typescript
interface StateManagement {
  id: string;
  library: string;
  storeDirectory: string;
  usagePattern: string;
}
```

### Custom Hook
```typescript
interface CustomHook {
  id: string;
  name: string;
  filePath: string;
  description: string;
  usage: string;
}
```

### Convention
```typescript
interface Convention {
  id: string;
  rule: string;
  description: string;
}
```

## Example Usage in Claude Code

Once configured, you can interact with the server through Claude Code:

```
/mcp
# Shows available MCP servers including components-mcp

# Claude can now use tools like:
# - get_components to list all components
# - create_component to add new components
# - get_apis to see API documentation
# - create_style_guide to document design patterns
```

## Data Storage

Data is persisted in `data/db.json` with the following structure:

```json
{
  "components": [],
  "apis": [],
  "environment": [],
  "style-guide": [],
  "state": [],
  "hooks": [],
  "conventions": []
}
```

## Development

```bash
# Start development server
npm run dev

# Type checking
npm run type-check

# Build TypeScript
npm run build
```

## Model Context Protocol

This server implements the MCP specification:

- **Transport**: stdio (standard input/output)
- **Tools**: 15+ tools for CRUD operations
- **Resources**: 7 resource endpoints for data access
- **Error Handling**: Proper MCP error responses
- **Type Safety**: Full TypeScript support

## Requirements

- Node.js 14+
- Claude Code (for MCP integration)

## License

MIT

## Version

1.0.5

## Author

bodangren

## Repository

https://github.com/bodangren/components-mcp