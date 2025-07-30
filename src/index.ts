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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
