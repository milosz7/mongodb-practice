import express from 'express';
import { ErrorData } from '../types/types';
import { error404 } from '../errors';
import Employee from '../models/employees.model';

const router = express.Router();

router.get('/employees', async (req, res, next: (err: ErrorData) => void) => {
  try {
    const employeesData = await Employee.find();
    if (employeesData.length === 0) return next(error404);
    return res.json(employeesData);
  } catch (e) {
    if (e instanceof Error) return next({ status: 500, message: e.message });
  }
});

router.get('/employees/random', async (req, res, next: (err: ErrorData) => void) => {
  try {
    const randomEmployee = await Employee.aggregate<typeof Employee>().sample(1);
    if (randomEmployee.length === 0) {
      return next(error404);
    }
    return res.json(randomEmployee);
  } catch (e) {
    if (e instanceof Error) return next({ status: 500, message: e.message });
  }
});

router.get('/employees/:id', async (req, res, next: (err: ErrorData) => void) => {
  try {
    const employeeData = await Employee.findById(req.params.id);
    if (!employeeData) return next(error404);
    return res.json(employeeData);
  } catch (e: any) {
    if (e instanceof Error) return next({ status: 500, message: e.message });
  }
});

router.post('/employees', async (req, res, next) => {
  const {
    firstName,
    lastName,
    department,
  }: {
    firstName: string | undefined;
    lastName: string | undefined;
    department: string | undefined;
  } = req.body;
  try {
    const newEmployee = new Employee({ department, firstName, lastName });
    await newEmployee.save();
    return res.status(200).send('OK');
  } catch (e) {
    if (e instanceof Error) return next({ status: 500, message: e.message });
  }
});

router.put('/employees/:id', async (req, res, next: (err: ErrorData) => void) => {
  try {
    const data: {
      firstName: string | undefined;
      lastName: string | undefined;
      department: string | undefined;
    } = req.body;
    const dataToEdit = await Employee.findById(req.params.id);
    if (!dataToEdit) {
      return next(error404);
    }
    (Object.keys(data) as (keyof typeof data)[]).forEach((key) => {
      if (typeof data[key] === 'string') {
        dataToEdit[key] = data[key] as string;
      }
    });
    await dataToEdit.save();
    return res.json(dataToEdit);
  } catch (e) {
    if (e instanceof Error) return next({ status: 500, message: e.message });
  }
});

router.delete('/employees/:id', async (req, res, next: (err: ErrorData) => void) => {
  try {
    const documentToRemove = await Employee.findById(req.params.id);
    if (!documentToRemove) return next(error404);
    await documentToRemove.delete();
    res.json(documentToRemove);
  } catch (e) {
    if (e instanceof Error) return next({ status: 500, message: e.message });
  }
});

export default router;
