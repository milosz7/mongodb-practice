import express from 'express';
import { ObjectId } from 'mongodb';
import { error500, error404, error400 } from '../errors';
import { productData } from '../types/types';

const router = express.Router();

router.get('/products', (req, res, next) => {
  req.db
    .collection<productData>('products')
    .find()
    .toArray((err, data) => {
      if (err) return next(error500);
      if (!data) return next(error404);
      return res.json(data);
    });
});

router.get('/products/random', (req, res, next) => {
  req.db
    .collection<productData>('products')
    .aggregate<productData>([{ $sample: { size: 1 } }])
    .toArray((err, data) => {
      if (err) return next(error500);
      return res.json(...data!);
    });
});

router.get('/products/:id', (req, res, next) => {
  const query = { _id: new ObjectId(req.params.id) };
  const employee = req.db.collection<productData>('products').findOne(query, (err, data) => {
    if (err) return next(error500);
    if (!data) return next(error404);
    return res.json(data);
  });
});

router.post('/products', (req, res, next) => {
  const { name, client }: { name: string | undefined; client: string | undefined } = req.body;
  if (name && client) {
    req.db.collection<productData>('products').insertOne({ name, client }, (err) => {
      if (err) return next(error500);
      return res.status(200).send('OK');
    });
  } else {
    return next(error400);
  }
});

router.put('/products/:id', (req, res, next) => {
  const query = { _id: new ObjectId(req.params.id) };
  const { name, client }: { name: string | undefined; client: string | undefined } = req.body;
  if (name && client) {
    req.db.collection<productData>('products').findOne(query, (err, data) => {
      if (err) return next(error500);
      if (!data) return next(error404);
      req.db
        .collection<productData>('products')
        .updateOne(query, { $set: { name, client } }, (err) => {
          if (err) return next(error500);
          return res.status(200).send('OK');
        });
    });
  } else {
    return next(error400);
  }
});

router.delete('/products/:id', (req, res, next) => {
  const query = { _id: new ObjectId(req.params.id) };
  req.db.collection<productData>('products').findOne(query, (err, data) => {
    if (err) return next(error500);
    if (!data) return next(error404);
    req.db.collection<productData>('products').deleteOne(query, (err) => {
      if (err) return next(error500);
      return res.status(200).send('OK');
    });
  });
});

export default router;
