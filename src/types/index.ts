export interface Component {
  id: string;
  name: string;
  description: string;
  snippet: string; // Filesystem location of the component
  category: string;
  dependencies: string[];
  usage: string;
}

export interface API {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  parameters: string;
  requestBody: string;
  responseBody: string;
}

export interface IEnvironmentVar {
  id: string;
  name: string;
  description: string;
  isPublic: boolean;
}

export interface IStyleGuide {
  id: string;
  element: string;
  description: string;
  className: string;
  usageExample: string;
}

export interface IStateManagement {
  id: string;
  library: string;
  storeDirectory: string;
  usagePattern: string;
}

export interface ICustomHook {
  id: string;
  name: string;
  filePath: string;
  description: string;
  usage: string;
}

export interface ICodeConvention {
  id: string;
  rule: string;
  description: string;
}

export interface DB {
  components: Component[];
  apis: API[];
  environmentVars: IEnvironmentVar[];
  styleGuide: IStyleGuide[];
  stateManagement: IStateManagement[];
  customHooks: ICustomHook[];
  codeConventions: ICodeConvention[];
}

