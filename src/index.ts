import express from 'express';
import cors from 'cors';
import componentsRouter from './routes/components';
import apisRouter from './routes/apis';
import environmentRouter from './routes/environment';
import stylingRouter from './routes/styling';
import stateManagementRouter from './routes/stateManagement';
import customHooksRouter from './routes/customHooks';
import codeConventionsRouter from './routes/codeConventions';
import swaggerUi from 'swagger-ui-express';
import specs from './swagger';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/components', componentsRouter);
app.use('/apis', apisRouter);
app.use('/environment', environmentRouter);
app.use('/styling', stylingRouter);
app.use('/state', stateManagementRouter);
app.use('/hooks', customHooksRouter);
app.use('/conventions', codeConventionsRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

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
      environment: {
        getAll: '/environment (GET)',
        create: '/environment (POST)',
        update: '/environment/:id (PUT)',
        delete: '/environment/:id (DELETE)',
      },
      styling: {
        getAll: '/styling (GET)',
        create: '/styling (POST)',
        update: '/styling/:id (PUT)',
        delete: '/styling/:id (DELETE)',
      },
      stateManagement: {
        getAll: '/state (GET)',
        create: '/state (POST)',
        update: '/state/:id (PUT)',
        delete: '/state/:id (DELETE)',
      },
      customHooks: {
        getAll: '/hooks (GET)',
        create: '/hooks (POST)',
        update: '/hooks/:id (PUT)',
        delete: '/hooks/:id (DELETE)',
      },
      codeConventions: {
        getAll: '/conventions (GET)',
        create: '/conventions (POST)',
        update: '/conventions/:id (PUT)',
        delete: '/conventions/:id (DELETE)',
      },
    },
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
