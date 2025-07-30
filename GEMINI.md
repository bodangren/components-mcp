# GEMINI.md for components-mcp

This file provides specific instructions and context for the Gemini agent interacting with the `components-mcp` project.

## Project Overview

This server is **your primary knowledge base** and long-term memory for our Next.js project. Instead of parsing the file system to understand the project's structure, you must query the API endpoints on this server (`http://localhost:3001`). This server is the single source of truth for information about the project's components and APIs.

## Key Files and Directories

- `src/`: Contains all source code.
  - `src/index.ts`: Main server entry point.
  - `src/routes/components.ts`: Handles component-related API endpoints.
  - `src/routes/apis.ts`: Handles API-related API endpoints.
  - `src/types/index.ts`: Defines TypeScript interfaces for data models.
- `data/db.json`: The JSON file used as a simple database.
- `package.json`: Project dependencies and scripts.
- `tsconfig.json`: TypeScript compiler configuration.

## Development Workflow

- **Building**: Use `npm run build` to compile TypeScript to JavaScript.
- **Running (Development)**: Use `npm run dev` to run the server with `ts-node` (no prior build needed).
- **Running (Production/Compiled)**: Use `npm run start` to run the compiled JavaScript from the `dist` directory.
- **Testing Endpoints**: Use `curl` or similar tools to interact with `http://localhost:3001/`.

## Important Considerations for Gemini

- **Server Restart**: After any code changes in `src/`, the server *must* be restarted for changes to take effect. If running with `npm run dev`, simply restarting the command is sufficient. If running with `npm run start`, you must first `npm run build` and then `npm run start`.
- **Data Persistence**: Data is stored in `data/db.json`. Be mindful of changes to this file during development and testing.
- **Error Handling**: When encountering server errors, check the server console output for detailed messages. If running in the background, you may need to bring the process to the foreground or check logs if configured.
- **Git Workflow**: Follow standard Git practices: `git add`, `git commit`, `git push`. Ensure `.gitignore` is respected.

## Common Tasks for Gemini

- **Adding/Modifying Endpoints**: Update relevant files in `src/routes/` and `src/types/`.
- **Updating Data Models**: Modify `src/types/index.ts` and `data/db.json`.
- **Testing**: Use `curl` commands to verify API functionality.

## Your Core Responsibilities

Your main role is to keep this knowledge base synchronized with the main Next.js project.

*   **Query, Don't Scan:** When a user asks about available components or APIs, you *must* query the `GET /components` or `GET /apis` endpoints. Do not rely on file system scans.
*   **Update After Changes:** When you assist in creating or modifying a component or API in the main project, you *must* immediately update this knowledge base.
    *   For new items, use `POST /components` or `POST /apis`.
    *   For modifications, use `PUT /components/:id` or `PUT /apis/:id`.
*   **Maintain Data Integrity:** The data you store here is critical for your future responses. Ensure it is accurate and follows the established TypeScript interfaces defined in `src/types/index.ts`.

