import Department from '../models/departments.model';
import { ErrorData, DepartmentResponse } from '../types/types';
import { Request, Response } from 'express';
import { error404 } from '../errors';

const departmentMethods = {
  getAll: async (req: Request, res: DepartmentResponse, next: (err: ErrorData) => void) => {
    try {
      const departmentData = await Department.find();
      if (departmentData.length === 0) return next(error404);
      return res.json(departmentData);
    } catch (e) {
      if (e instanceof Error) return next({ status: 500, message: e.message });
    }
  },

  getRandom: async (req: Request, res: DepartmentResponse, next: (err: ErrorData) => void) => {
    try {
      const randomDepartmentData = await Department.aggregate<typeof Department>().sample(1);
      if (randomDepartmentData.length === 0) return next(error404);
      return res.json(randomDepartmentData);
    } catch (e) {
      if (e instanceof Error) return next({ status: 500, message: e.message });
    }
  },

  getById: async (req: Request, res: DepartmentResponse, next: (err: ErrorData) => void) => {
    try {
      const departmentData = await Department.findById(req.params.id);
      if (!departmentData) return next(error404);
      res.json(departmentData);
    } catch (e) {
      if (e instanceof Error) return next({ status: 500, message: e.message });
    }
  },

  postNew: async (req: Request, res: Response<string>, next: (err: ErrorData) => void) => {
    try {
      const { name }: { name: string | undefined } = req.body;
      const newDepartment = new Department({ name });
      await newDepartment.save();
      return res.status(200).send('OK');
    } catch (e) {
      if (e instanceof Error) return next({ status: 500, message: e.message });
    }
  },

  edit: async (req: Request, res: DepartmentResponse, next: (err: ErrorData) => void) => {
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
  },

  delete: async (req: Request, res: DepartmentResponse, next: (err: ErrorData) => void) => {
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
  },
};

export default departmentMethods;
