import { model, InferSchemaType, Schema } from 'mongoose';

const productSchema = new Schema({
  name: {type: String, required: true},
  client: {type: String, required: true},
});

type ProductModel = InferSchemaType<typeof productSchema>;

const Product = model<ProductModel>('Product', productSchema);

export default Product;
