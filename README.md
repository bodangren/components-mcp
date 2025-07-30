# Knowledge-Base Server for the "[Your Project Name]" Next.js Project

This project is a dedicated knowledge-base server. Its primary purpose is to provide a persistent, queryable memory for an LLM agent (e.g., Gemini) that assists with the development of our main Next.js project. It stores canonical information about the project's components and APIs, allowing the LLM to access up-to-date details without having to parse the entire codebase repeatedly. This includes details about available components, sample code snippets, and API specifications.

## Features

- **Code Conventions API**: Manage information about code conventions.
  - `GET /conventions`: Get all code conventions.
  - `POST /conventions`: Add a new code convention.
  - `PUT /conventions/{id}`: Update a code convention by ID.
  - `DELETE /conventions/{id}`: Delete a code convention by ID.
- **Custom Hooks API**: Manage information about custom hooks.
  - `GET /hooks`: Get all custom hooks.
  - `POST /hooks`: Add a new custom hook.
  - `PUT /hooks/{id}`: Update a custom hook by ID.
  - `DELETE /hooks/{id}`: Delete a custom hook by ID.
- **Environment Variables API**: Manage information about environment variables.
  - `GET /environment`: Get all environment variables.
  - `POST /environment`: Add a new environment variable.
  - `PUT /environment/{id}`: Update an environment variable by ID.
  - `DELETE /environment/{id}`: Delete an environment variable by ID.
- **State Management API**: Manage information about state management configurations.
  - `GET /state`: Get all state management configurations.
  - `POST /state`: Add a new state management configuration.
  - `PUT /state/{id}`: Update a state management configuration by ID.
  - `DELETE /state/{id}`: Delete a state management configuration by ID.
- **Styling API**: Manage information about styling configurations.
  - `GET /styling`: Get all styling configurations.
  - `POST /styling`: Add a new styling configuration.
  - `PUT /styling/{id}`: Update a styling configuration by ID.
  - `DELETE /styling/{id}`: Delete a styling configuration by ID.
- **APIs API**: Manage information about available APIs.
  - `GET /apis`: Retrieve a list of APIs.
  - `POST /apis`: Create a new API.
  - `GET /apis/{id}`: Retrieve a single API by ID.
  - `PUT /apis/{id}`: Update an API by ID.
  - `DELETE /apis/{id}`: Delete an API.
- **Components API**: Manage information about reusable Next.js components.
  - `GET /components`: Retrieve a list of components.
  - `POST /components`: Create a new component.
  - `GET /components/{id}`: Retrieve a single component by ID.
  - `PUT /components/{id}`: Update a component by ID.
  - `DELETE /components/{id}`: Delete a component.

## Schemas

- `IEnvironmentVar`
- `IStyling`
- `IStateManagement`
- `ICustomHook`
- `ICodeConvention`
- `API`
- `APIInput`
- `Component`
- `ComponentSummary`
- `ComponentInput`

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

## Purpose and AI-Assisted Workflow

This server is not intended for direct human interaction in a production environment. Instead, it runs locally during development and serves as the single source of truth for our project's key architectural pieces.

The intended workflow is:
1.  The developer interacts with an LLM agent to ask questions or issue commands related to the main Next.js project.
2.  The LLM agent queries this server's API (`/apis`, `/components`) to retrieve accurate, structured information.
3.  When a developer asks the LLM to create or modify a component or API, the LLM will use this server's `POST` or `PUT` endpoints to update the knowledge base accordingly.
