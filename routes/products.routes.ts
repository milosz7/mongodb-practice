import express from 'express';
import { error404 } from '../errors';
import { ErrorData } from '../types/types';
import Product from '../models/products.model';

const router = express.Router();

router.get('/products', async (req, res, next: (err: ErrorData) => void) => {
  try {
    const productsData = await Product.find();
    if (productsData.length === 0) return next(error404);
    return res.json(productsData);
  } catch (e) {
    if (e instanceof Error) return next({ status: 500, message: e.message });
  }
});

router.get('/products/random', async (req, res, next: (err: ErrorData) => void) => {
  try {
    const randomProduct = await Product.aggregate<typeof Product>().sample(1);
    if (randomProduct.length === 0) return next(error404);
    return res.json(randomProduct);
  } catch (e) {
    if (e instanceof Error) return next({status: 500, message: e.message});
  }
});

router.get('/products/:id', async (req, res, next: (err: ErrorData) => void) => {
  try {
    const productData = await Product.findById(req.params.id);
    if (!productData) return next(error404);
    return res.json(productData);
  } catch (e) {
    if (e instanceof Error) return next({status: 500, message: e.message})
  }
});

router.post('/products', async (req, res, next: (err: ErrorData) => void) => {
  try {
    const { name, client }: { name: string | undefined; client: string | undefined } = req.body;
    const newProduct = new Product({name, client});
    await newProduct.save();    
    return res.status(200).send('OK');
  } catch (e) {
    if (e instanceof Error) return next({status: 500, message: e.message})    
  }
});

router.put('/products/:id', async (req, res, next: (err: ErrorData) => void) => {
  try {
    const data: { name: string | undefined; client: string | undefined } = req.body;
    const dataToEdit = await Product.findById(req.params.id);
    if (!dataToEdit) return next(error404);
    (Object.keys(data) as (keyof typeof data)[]).forEach(key => {
      if (typeof data[key] === 'string') {
        dataToEdit[key] = data[key] as string
      }
    })
    await dataToEdit.save();
    return res.json(dataToEdit);
  } catch (e) {
    if (e instanceof Error) return next({status: 500, message: e.message})        
  }
});

router.delete('/products/:id', async (req, res, next: (err: ErrorData) => void) => {
  try {
    const dataToRemove = await Product.findById(req.params.id);
    if (!dataToRemove) return next(error404);
    await dataToRemove.delete();
    return res.json(dataToRemove);    
  } catch (e) {
    if (e instanceof Error) return next({status: 500, message: e.message})            
  }
});

export default router;
