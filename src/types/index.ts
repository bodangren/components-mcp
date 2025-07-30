export interface Component {
  id: string;
  name: string;
  description: string;
  snippet: string;
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

export interface DB {
  components: Component[];
  apis: API[];
}
