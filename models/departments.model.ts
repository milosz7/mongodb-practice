import { Schema, model, InferSchemaType } from "mongoose";

const departmentSchema = new Schema({
  name: {type: String, required: true},
  _id: {type: Schema.Types.ObjectId},
});

export type DepartmentModel = InferSchemaType<typeof departmentSchema>

const Department = model<DepartmentModel>('Department', departmentSchema);

export default Department;

