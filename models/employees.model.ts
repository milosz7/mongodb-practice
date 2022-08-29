import { Schema, model, InferSchemaType } from "mongoose";

const employeeSchema = new Schema({
  department: {type: Schema.Types.ObjectId, required: true, ref: 'Department'},
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
});

export type EmployeeModel = InferSchemaType<typeof employeeSchema>;

const Employee = model<EmployeeModel>('Employee', employeeSchema);

export default Employee;
