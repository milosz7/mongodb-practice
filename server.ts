import express from 'express';
import cors from 'cors';
import employeesRoutes from './routes/employees.routes';
import departmentsRoutes from './routes/departments.routes';
import productsRoutes from './routes/products.routes';
import * as mongoDB from 'mongodb';
import { errorData } from './types/types';

const uri = 'mongodb://localhost:27017';

const client = new mongoDB.MongoClient(uri);

const connectToDb = async () => {
  try {
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    console.log('Connected to database!');

  } catch (e: any) {
    console.log(e.message);
    await client.close();
  }
};

connectToDb()
  .then(() => {
    const app = express();
    const db = client.db('companyDB');

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use((req, res, next) => {
      req.db = db;
      next();
    });

    app.use('/api', employeesRoutes);
    app.use('/api', departmentsRoutes);
    app.use('/api', productsRoutes);

    app.use((err: errorData, req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.status(err.status).send({ message: err.message });
    });

    app.listen('8000', () => {
      console.log('Server is running on port: 8000');
    });
  })
  .catch((err: Error) => {
    console.log(err.message);
  });
