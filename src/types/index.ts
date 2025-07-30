export interface Component {
  id: string;
  name: string;
  description: string;
  snippet: string;
}

export interface API {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
}

export interface DB {
  components: Component[];
  apis: API[];
}