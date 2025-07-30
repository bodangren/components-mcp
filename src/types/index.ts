/**
 * Describes a reusable component in the Next.js project.
 * Handled by the /components endpoint.
 */
export interface IComponent {
  id: string;
  name: string;
  description: string;
  filePath: string;
  usageExample?: string;
}

/**
 * Describes an API endpoint that the Next.js project consumes or exposes.
 * Handled by the /apis endpoint.
 */
export interface IApi {
  id: string;
  name: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  description: string;
  requestBody?: object;
  responseBody?: object;
}

/**
 * Describes a specific styling rule or pattern from the project's design system.
 * Handled by the /style-guide endpoint.
 */
export interface IStyleGuidePattern {
  id: string;
  element: string;
  description: string;
  className: string;
  usageExample?: string;
}

/**
 * Describes a required environment variable for the project.
 * Handled by the /environment endpoint.
 */
export interface IEnvironmentVariable {
  id: string;
  name: string;
  description: string;
  isPublic: boolean;
}

/**
 * Describes the project's global state management strategy.
 * Handled by the /state endpoint.
 */
export interface IStateManagement {
  id: string;
  library: string;
  storeDirectory: string;
  usagePattern: string;
}

/**
 * Describes a reusable custom hook.
 * Handled by the /hooks endpoint.
 */
export interface ICustomHook {
  id: string;
  name: string;
  filePath: string;
  description: string;
  usage: string;
}

/**
 * Describes a specific coding convention or linting rule.
 * Handled by the /conventions endpoint.
 */
export interface IConvention {
  id: string;
  rule: string;
  description: string;
}