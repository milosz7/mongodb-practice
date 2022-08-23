import express from 'express';
import { error400, error404 } from '../errors';
import Department from '../models/departments.model';
import { ErrorData } from '../types/types';

const router = express.Router();

router.get('/departments', async (req, res, next: (err: ErrorData) => void) => {
  try {
    if ((await Department.find()).length === 0) return next(error404);
    return res.json(await Department.find());
  } catch (e: any) {
    return next({ status: 500, message: e.message });
  }
});

router.get('/departments/random', async (req, res, next: (err: ErrorData) => void) => {
  try {
    if ((await Department.find()).length === 0) return next(error404);
    res.json(await Department.aggregate<typeof Department>().sample(1));
  } catch (e: any) {
    return next({ status: 500, message: e.message });
  }
});

router.get('/departments/:id', async (req, res, next: (err: ErrorData) => void) => {
  try {
    if ((await Department.find()).length === 0) return next(error404);
    const data = await Department.findById(req.params.id);
    if (!data) return next(error404);
    res.json(data);
  } catch (e: any) {
    return next({ status: 500, message: e.message });
  }
});

router.post('/departments', async (req, res, next: (err: ErrorData) => void) => {
  try {
    const { name }: { name: string | undefined } = req.body;
    if (name) {
      const newDepartment = new Department({ name });
      await newDepartment.save();
      return res.status(200).send('OK');
    }
    if (!name) next(error400);
  } catch (e: any) {
    return next({ status: 500, message: e.message });
  }
});

router.put('/departments/:id', async (req, res, next: (err: ErrorData) => void) => {
  try {
    const { name }: { name: string | undefined } = req.body;
    if (!name) {
      return next(error400);
    }
    if (name) {
      const dataToUpdate = await Department.findById(req.params.id);
      if (!dataToUpdate) return next(error404);
      if (dataToUpdate) {
        dataToUpdate.name = name;
        await dataToUpdate.save();
        return res.json(dataToUpdate);
      }
    }
  } catch (e: any) {
    return next({ status: 500, message: e.message });
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
  } catch (e: any) {
    return next({ status: 500, message: e.message });
  }
});

export default router;
