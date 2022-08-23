import { Schema, model, InferSchemaType } from "mongoose";

const departmentSchema = new Schema({
  name: {type: String, required: true},
});

type DepartmentModel = InferSchemaType<typeof departmentSchema>

const Department = model<DepartmentModel>('Department', departmentSchema);

export default Department;

