# Components MCP Server

A Master Control Program (MCP) server for managing project components, APIs, and coding standards. This server provides a queryable knowledge base for software projects with full CRUD operations and interactive API documentation.

## Features

- **Component Management**: Track reusable UI components with file paths and usage examples
- **API Documentation**: Manage internal API endpoints with full request/response details
- **Environment Variables**: Document required environment variables
- **Style Guide**: Maintain design system patterns and CSS classes
- **State Management**: Document global state management strategies
- **Custom Hooks**: Track reusable React hooks
- **Code Conventions**: Maintain coding standards and linting rules
- **Interactive API Docs**: Swagger UI documentation at `/api-docs`
- **TypeScript Support**: Full type definitions included

## Installation

```bash
npm install components-mcp
```

## Quick Start

```bash
# Start the server
npm start

# Development mode with auto-restart
npm run dev

# TypeScript type checking
npm run type-check

# Build TypeScript (if needed)
npm run build
```

The server will start on `http://localhost:3000` by default.

## API Endpoints

### Root
- `GET /` - Welcome message and endpoint summary

### Components
- `GET /components` - List all components (summary)
- `GET /components/:id` - Get component details
- `POST /components` - Create new component
- `PUT /components/:id` - Update component
- `DELETE /components/:id` - Delete component

### APIs
- `GET /apis` - List all APIs (summary)
- `GET /apis/:id` - Get API details
- `POST /apis` - Create new API
- `PUT /apis/:id` - Update API
- `DELETE /apis/:id` - Delete API

### Other Entities
Full CRUD operations available for:
- `/environment` - Environment variables
- `/style-guide` - Style guide patterns
- `/state` - State management
- `/hooks` - Custom hooks
- `/conventions` - Code conventions

### Documentation
- `GET /api-docs` - Interactive Swagger UI documentation

## Data Models

### Component
```typescript
interface IComponent {
  id: string;
  name: string;
  description: string;
  filePath: string;
  usageExample?: string;
}
```

### API
```typescript
interface IApi {
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
interface IEnvironmentVariable {
  id: string;
  name: string;
  description: string;
  isPublic: boolean;
}
```

### Style Guide Pattern
```typescript
interface IStyleGuidePattern {
  id: string;
  element: string;
  description: string;
  className: string;
  usageExample?: string;
}
```

### State Management
```typescript
interface IStateManagement {
  id: string;
  library: string;
  storeDirectory: string;
  usagePattern: string;
}
```

### Custom Hook
```typescript
interface ICustomHook {
  id: string;
  name: string;
  filePath: string;
  description: string;
  usage: string;
}
```

### Convention
```typescript
interface IConvention {
  id: string;
  rule: string;
  description: string;
}
```

## Example Usage

### Create a Component
```bash
curl -X POST http://localhost:3000/components \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Button",
    "description": "Primary button component",
    "filePath": "src/components/Button.tsx",
    "usageExample": "<Button onClick={handleClick}>Click me</Button>"
  }'
```

### Get All Components
```bash
curl http://localhost:3000/components
```

### Get Component Details
```bash
curl http://localhost:3000/components/{id}
```

## Data Storage

Data is persisted in `data/db.json` as a single JSON file with the following structure:

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

## Configuration

### Environment Variables
- `PORT` - Server port (default: 3000)

### Package.json Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with auto-restart
- `npm run build` - Build TypeScript files
- `npm run type-check` - Run TypeScript type checking

## Development

The project includes:
- Express.js server with CORS support
- Swagger/OpenAPI documentation
- TypeScript type definitions
- Auto-generated unique IDs for all entities
- Error handling for all endpoints

## License

MIT

## Version

1.0.5