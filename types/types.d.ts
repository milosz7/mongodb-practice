import  { Db, ObjectId } from 'mongodb';

declare global {
  namespace Express {
    interface Request {
      db: Db
    }
  }
}

interface errorData {
  status: number
  message: string
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
