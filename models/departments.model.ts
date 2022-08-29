import { Schema, model, InferSchemaType } from "mongoose";

const departmentSchema = new Schema({
  name: { type: String, required: true, minLength: 3, maxLength: 15 },
});

export type DepartmentModel = InferSchemaType<typeof departmentSchema>;

const Department = model<DepartmentModel>('Department', departmentSchema);

export default Department;
