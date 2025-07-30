# MCP Server for Next.js Development

This project provides a centralized Micro-Component Platform (MCP) server designed to store and retrieve essential information for Next.js development. This includes details about available components, sample code snippets, and API specifications.

## Features

- **Components API**: Manage information about reusable Next.js components.
  - `GET /components`: Retrieve all components.
  - `GET /components/:id`: Retrieve a specific component by ID.
  - `POST /components`: Add a new component.
  - `PUT /components/:id`: Update an existing component.
  - `DELETE /components/:id`: Delete a component.
- **APIs API**: Manage information about available APIs.
  - `GET /apis`: Retrieve all APIs.
  - `GET /apis/:id`: Retrieve a specific API by ID.
  - `POST /apis`: Add a new API.
  - `PUT /apis/:id`: Update an existing API.
  - `DELETE /apis/:id`: Delete an API.
- **Root Endpoint Documentation**: A `/` endpoint provides an overview of all available API endpoints.

## Project Structure

```
/
├── data/
│   └── db.json
├── dist/ (compiled JavaScript output)
├── src/
│   ├── index.ts (main server file)
│   ├── routes/
│   │   ├── components.ts (component API routes)
│   │   └── apis.ts (API API routes)
│   └── types/
│       └── index.ts (TypeScript interfaces)
├── package.json
├── tsconfig.json
├── README.md
├── GEMINI.md
└── .gitignore
```

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/bodangren/components-mcp.git
    cd components-mcp
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Build the project:**
    ```bash
    npm run build
    ```

## Running the Server

To run the server in development mode (with `ts-node`):

```bash
npm run dev
```

To run the compiled server:

```bash
npm run start
```

The server will run on `http://localhost:3001`.

## Data Storage

API data is stored in `data/db.json`. This is a simple JSON file for easy local management. For production environments, consider migrating to a more robust database solution.
