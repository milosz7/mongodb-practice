import  { Db, ObjectId } from 'mongodb';

declare global {
  namespace Express {
    interface Request {
      db: Db
    }
  }
}

interface employeeData {
  _id?: ObjectId
  firstName: string
  lastName: string
  department: string
} 

interface departmentData {
  _id?: ObjectId
  name: string;
}

interface productData {
  _id?: ObjectId
  name: string;
  client: string;
}

export interface dbData {
  employees: employeeData[];
  departments: departmentData[];
  products: productData[];
} 