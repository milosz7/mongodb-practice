import { Response } from 'express';
import { DepartmentModel } from '../models/departments.model';
import { EmployeeModel } from '../models/employees.model';
import { ProductModel } from '../models/products.model';

export interface ErrorData {
  status: number;
  message: string;
}

export type DepartmentResponse = Response<
  DepartmentModel[] | DepartmentModel,
  Record<string, DepartmentModel>
>;

export type EmployeeResponse = Response<
  EmployeeModel[] | EmployeeModel,
  Record<string, EmployeeModel>
>;

export type ProductResponse = Response<
  ProductModel[] | ProductModel,
  Record<string, ProductModel>
>;

export type ExtendedEmployeeResponse = Response<
  {editedData: EmployeeModel, message: string},
  Record<string, {editedData: EmployeeModel, message: string} >
>
