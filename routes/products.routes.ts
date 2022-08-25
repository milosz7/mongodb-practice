import express from 'express';
import productsMethods from '../methods/products.methods';

const router = express.Router();

router.get('/products', productsMethods.getAll);

router.get('/products/random', productsMethods.getRandom);

router.get('/products/:id', productsMethods.getById);

router.post('/products', productsMethods.addNew);

router.put('/products/:id', productsMethods.edit);

router.delete('/products/:id', productsMethods.delete);

export default router;
