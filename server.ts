import express from 'express';
import cors from 'cors';
import employeesRoutes from './routes/employees.routes';
import departmentsRoutes from './routes/departments.routes';
import productsRoutes from './routes/products.routes';
import mongoose from 'mongoose';
import { ErrorData } from './types/types';

const uri = 'mongodb://localhost:27017/companyDB';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', employeesRoutes);
app.use('/api', departmentsRoutes);
app.use('/api', productsRoutes);

app.use(
  (err: ErrorData, req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(err.status).send({ message: err.message });
  }
);

mongoose.connect(uri);
const db = mongoose.connection;

db.once('open', () => {
  console.log('Connected to the database');
});

db.on('error', (err) => console.log('Error ' + err));

app.listen('8000', () => {
  console.log('Server is running on port: 8000');
});
