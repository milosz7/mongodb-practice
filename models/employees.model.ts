import { Schema, model, InferSchemaType } from "mongoose";

const employeeSchema = new Schema({
  department: {type: String, required: true},
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
});

type EmployeeModel = InferSchemaType<typeof employeeSchema>;

const Employee = model<EmployeeModel>('Employee', employeeSchema);

export default Employee;
