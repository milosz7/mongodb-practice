import Employee from '../models/employees.model';
import Department from '../models/departments.model';
import { error404 } from '../errors';
import { EmployeeResponse, ExtendedEmployeeResponse, ErrorData } from '../types/types';
import { Request, Response } from 'express';

const employeeMethods = {
  getAll: async (req: Request, res: EmployeeResponse, next: (err: ErrorData) => void) => {
    try {
      const employeesData = await Employee.find().populate('department');
      if (employeesData.length === 0) return next(error404);
      return res.json(employeesData);
    } catch (e) {
      if (e instanceof Error) return next({ status: 500, message: e.message });
    }
  },
  getRandom: async (req: Request, res: EmployeeResponse, next: (err: ErrorData) => void) => {
    try {
      const randomEmployee = await Employee.aggregate<typeof Employee>().sample(1);
      if (randomEmployee.length === 0) {
        return next(error404);
      }
      const populatedRandom = await Employee.populate(randomEmployee, 'firstName');
      return res.json(populatedRandom);
    } catch (e) {
      if (e instanceof Error) return next({ status: 500, message: e.message });
    }
  },
  getById: async (req: Request, res: EmployeeResponse, next: (err: ErrorData) => void) => {
    try {
      const employeeData = await Employee.findById(req.params.id).populate('department');
      if (!employeeData) return next(error404);
      return res.json(employeeData);
    } catch (e: any) {
      if (e instanceof Error) return next({ status: 500, message: e.message });
    }
  },
  addNew: async (req: Request, res: Response<string>, next: (err: ErrorData) => void) => {
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
      const newEmployeeDepartment = await Department.findOne({ name: department });
      if (!newEmployeeDepartment)
        return next({ status: 404, message: 'There is no such department!' });
      const newEmployee = new Employee({
        firstName,
        lastName,
        department: newEmployeeDepartment._id,
      });
      await newEmployee.save();
      return res.status(200).send('OK');
    } catch (e) {
      if (e instanceof Error) return next({ status: 500, message: e.message });
    }
  },
  edit: async (req: Request, res: EmployeeResponse, next: (err: ErrorData) => void) => {
    const data: {
      firstName: string | undefined;
      lastName: string | undefined;
      department: string | undefined;
    } = req.body;
    try {
      const dataToEdit = await Employee.findById(req.params.id);
      const newEmployeeDepartment = await Department.findOne({ name: data.department });
      if (!dataToEdit) {
        return next(error404);
      }
      (Object.keys(data) as (keyof typeof data)[]).forEach((key) => {
        if (key !== 'department' && typeof data[key] === 'string') {
          dataToEdit[key] = data[key] as string;
        }
        if (newEmployeeDepartment) dataToEdit.department = newEmployeeDepartment._id;
      });
      await dataToEdit.save();
      if (data.department && !newEmployeeDepartment) {
        return (res as unknown as ExtendedEmployeeResponse).json({
          editedData: dataToEdit,
          message: 'There is no such department, skipping field.',
        });
      }
      return res.json(dataToEdit);
    } catch (e) {
      if (e instanceof Error) return next({ status: 500, message: e.message });
    }
  },
  delete: async (req: Request, res: EmployeeResponse, next: (err: ErrorData) => void) => {
    try {
      const documentToRemove = await Employee.findById(req.params.id);
      if (!documentToRemove) return next(error404);
      await documentToRemove.delete();
      res.json(documentToRemove);
    } catch (e) {
      if (e instanceof Error) return next({ status: 500, message: e.message });
    }
  },
};

export default employeeMethods;
