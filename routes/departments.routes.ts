import express from 'express';
import { error404 } from '../errors';
import Department from '../models/departments.model';
import { ErrorData } from '../types/types';

const router = express.Router();

router.get('/departments', async (req, res, next: (err: ErrorData) => void) => {
  try {
    const departmentData = await Department.find();
    if (departmentData.length === 0) return next(error404);
    return res.json(departmentData);
  } catch (e) {
    if (e instanceof Error) return next({ status: 500, message: e.message });
  }
});

router.get('/departments/random', async (req, res, next: (err: ErrorData) => void) => {
  try {
    const randomDepartmentData = await Department.aggregate<typeof Department>().sample(1);
    if (randomDepartmentData.length === 0) return next(error404);
    res.json(randomDepartmentData);
  } catch (e) {
    if (e instanceof Error) return next({ status: 500, message: e.message });
  }
});

router.get('/departments/:id', async (req, res, next: (err: ErrorData) => void) => {
  try {
    const departmentData = await Department.findById(req.params.id);
    if (!departmentData) return next(error404);
    res.json(departmentData);
  } catch (e) {
    if (e instanceof Error) return next({ status: 500, message: e.message });
  }
});

router.post('/departments', async (req, res, next: (err: ErrorData) => void) => {
  try {
    const { name }: { name: string | undefined } = req.body;
      const newDepartment = new Department({ name });
      await newDepartment.save();
      return res.status(200).send('OK');
  } catch (e) {
    if (e instanceof Error) return next({ status: 500, message: e.message });
  }
});

router.put('/departments/:id', async (req, res, next: (err: ErrorData) => void) => {
  try {
    const { name }: { name: string | undefined } = req.body;
      const dataToUpdate = await Department.findById(req.params.id);
      if (!dataToUpdate) return next(error404);
      if (dataToUpdate && name) {
        dataToUpdate.name = name;
        await dataToUpdate.save();
        return res.json(dataToUpdate);
    }
  } catch (e) {
    if (e instanceof Error) return next({ status: 500, message: e.message });
  }
});

router.delete('/departments/:id', async (req, res, next: (err: ErrorData) => void) => {
  try {
    const dataToRemove = await Department.findById(req.params.id);
    if (!dataToRemove) {
      return next(error404);
    }
    await dataToRemove.delete();
    return res.json(dataToRemove);
  } catch (e) {
    if (e instanceof Error) return next({ status: 500, message: e.message });
  }
});

export default router;
