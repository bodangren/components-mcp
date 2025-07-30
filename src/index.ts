import express from 'express';
import cors from 'cors';
import componentsRouter from './routes/components';
import apisRouter from './routes/apis';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/components', componentsRouter);
app.use('/apis', apisRouter);

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the MCP Server API!',
    endpoints: {
      components: {
        getAll: '/components (GET)',
        getById: '/components/:id (GET)',
        create: '/components (POST)',
        update: '/components/:id (PUT)',
        delete: '/components/:id (DELETE)',
      },
      apis: {
        getAll: '/apis (GET)',
        getById: '/apis/:id (GET)',
        create: '/apis (POST)',
        update: '/apis/:id (PUT)',
        delete: '/apis/:id (DELETE)',
      },
    },
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
