import { Schema, model, InferSchemaType } from "mongoose";
import { disallowNumbers } from "./validators/validators";

const departmentSchema = new Schema({
  name: { type: String, required: true, minLength: 3, maxLength: 15, validate: disallowNumbers },
});

export type DepartmentModel = InferSchemaType<typeof departmentSchema>;

const Department = model<DepartmentModel>('Department', departmentSchema);

export default Department;
