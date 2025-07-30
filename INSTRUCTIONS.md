# MCP Server System Specification

## 1. Overview

This document specifies the functional requirements for the Master Control Program (MCP) server. The system's primary purpose is to provide a queryable knowledge base for a software project. It shall expose a well-defined interface to manage information about various project assets, including UI components, internal APIs, and coding standards.

## 2. System Requirements

### 2.1. Data Persistence
To maintain data compatibility with the previous system, the server shall use a single JSON file named `db.json` for data storage. This file will be located in a `data` directory at the project root. The file must contain a top-level object where keys correspond to the data models defined below.

### 2.2. Client Accessibility
The server must be accessible to clients on the same local machine, including command-line tools (like the Gemini CLI) and, potentially, web-based clients. The communication protocol chosen must not prevent such local access.

### 2.3. API Documentation
The system shall provide interactive, human-readable documentation for its API. This documentation must be available at the `/api-docs` endpoint and should clearly describe every endpoint, its parameters, and its expected request/response structures.

## 3. Data Models

The server shall manage the following data entities. Each entity must have a unique, system-generated ID.

### 3.1. Component
Represents a reusable UI component.
- **`id`**: `string` (Unique Identifier)
- **`name`**: `string`
- **`description`**: `string`
- **`snippet`**: `string` (A reference to the component's source, e.g., a file path)
- **`category`**: `string` (e.g., "UI", "Layout")
- **`dependencies`**: `string[]` (An array of dependency names)
- **`usage`**: `string` (Code example or instructions)

### 3.2. API
Represents an internal API endpoint.
- **`id`**: `string` (Unique Identifier)
- **`name`**: `string`
- **`description`**: `string`
- **`endpoint`**: `string` (The URL path)
- **`method`**: `string` (The communication method, e.g., 'GET', 'POST')
- **`parameters`**: `string` (Description of parameters)
- **`requestBody`**: `string` (Description of the request body)
- **`responseBody`**: `string` (Description of the response body)

### 3.3. Environment Variable (`IEnvironmentVar`)
- **`id`**: `string`
- **`name`**: `string`
- **`description`**: `string`
- **`isPublic`**: `boolean`

### 3.4. Style Guide Rule (`IStyleGuide`)
- **`id`**: `string`
- **`element`**: `string`
- **`description`**: `string`
- **`className`**: `string`
- **`usageExample`**: `string`

### 3.5. State Management (`IStateManagement`)
- **`id`**: `string`
- **`library`**: `string`
- **`storeDirectory`**: `string`
- **`usagePattern`**: `string`

### 3.6. Custom Hook (`ICustomHook`)
- **`id`**: `string`
- **`name`**: `string`
- **`filePath`**: `string`
- **`description`**: `string`
- **`usage`**: `string`

### 3.7. Code Convention (`ICodeConvention`)
- **`id`**: `string`
- **`rule`**: `string`
- **`description`**: `string`

## 4. Interface Contract (API)

The server shall expose an interface for interaction. The following defines the contract for this interface. All data exchange is expected to be in JSON format.

### 4.1. Root
- **Endpoint**: `GET /`
  - **Description**: Returns a welcome message and a summary of all available endpoints.
  - **Success Response**: A JSON object with a welcome message and a structured list of endpoints.

### 4.2. Components
- **Endpoint**: `GET /components`
  - **Description**: Retrieve a summary list of all components.
  - **Success Response**: An array of objects, each containing the `id`, `name`, `description`, and `category` of a component.

- **Endpoint**: `GET /components/:id`
  - **Description**: Retrieve full details for a single component.
  - **Success Response**: A single `Component` object.
  - **Error Response**: If no component with the given ID exists.

- **Endpoint**: `POST /components`
  - **Description**: Create a new component.
  - **Payload**: A JSON object matching the `Component` model (excluding `id`).
  - **Success Response**: The newly created `Component` object, including its `id`.
  - **Error Response**: If the payload is invalid or missing required fields.

- **Endpoint**: `PUT /components/:id`
  - **Description**: Update an existing component.
  - **Payload**: A JSON object with all fields for a component.
  - **Success Response**: The updated `Component` object.
  - **Error Response**: If no component with the given ID exists or the payload is invalid.

- **Endpoint**: `DELETE /components/:id`
  - **Description**: Delete a component.
  - **Success Response**: A confirmation of successful deletion.
  - **Error Response**: If no component with the given ID exists.

### 4.3. APIs
- **Endpoint**: `GET /apis`
  - **Description**: Retrieve a summary list of all APIs.
  - **Success Response**: An array of objects, each containing the `id`, `name`, and `description` of an API.

- **Endpoint**: `GET /apis/:id`
  - **Description**: Retrieve full details for a single API.
  - **Success Response**: A single `API` object.
  - **Error Response**: If no API with the given ID exists.

- **Endpoint**: `POST /apis`
  - **Description**: Create a new API entry.
  - **Payload**: A JSON object matching the `API` model (excluding `id`).
  - **Success Response**: The newly created `API` object, including its `id`.
  - **Error Response**: If the payload is invalid.

- **Endpoint**: `PUT /apis/:id`
  - **Description**: Update an existing API entry.
  - **Payload**: A JSON object with all fields for an API.
  - **Success Response**: The updated `API` object.
  - **Error Response**: If no API with the given ID exists or the payload is invalid.

- **Endpoint**: `DELETE /apis/:id`
  - **Description**: Delete an API entry.
  - **Success Response**: A confirmation of successful deletion.
  - **Error Response**: If no API with the given ID exists.

### 4.4. Other Entities
Equivalent CRUD (Create, Read, Update, Delete) interfaces shall be provided for the following data models at the specified routes:
- **Environment Variables**: `/environment`
- **Style Guide**: `/style-guide`
- **State Management**: `/state`
- **Custom Hooks**: `/hooks`
- **Code Conventions**: `/conventions`
