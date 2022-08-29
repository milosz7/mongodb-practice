import { Schema, model, InferSchemaType } from "mongoose";
import { disallowNumbers } from "./validators/validators";

const employeeSchema = new Schema({
  department: { type: Schema.Types.ObjectId, required: true, ref: 'Department' },
  firstName: { type: String, required: true, validate: disallowNumbers },
  lastName: { type: String, required: true, validate: disallowNumbers },
});

export type EmployeeModel = InferSchemaType<typeof employeeSchema>;

const Employee = model<EmployeeModel>('Employee', employeeSchema);

export default Employee;
