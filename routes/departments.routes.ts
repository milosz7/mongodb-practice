import express from 'express';
import { ObjectId } from 'mongodb';
import { departmentData } from '../types/types';
import { error500, error400, error404 } from '../errors';

const router = express.Router();

router.get('/departments', (req, res, next) => {
  req.db
    .collection('departments')
    .find()
    .toArray((err, data) => {
      if (err) return next(error500);
      return res.json(data);
    });
});

router.get('/departments/random', (req, res, next) => {
  req.db
    .collection<departmentData>('departments')
    .aggregate([{ $sample: { size: 1 } }])
    .toArray((err, data) => {
      if (err) next(error500);
      return res.json(...data!);
    });
});

router.get('/departments/:id', (req, res, next) => {
  const query = { _id: new ObjectId(req.params.id) };
  const department = req.db.collection('departments').findOne(query, (err, data) => {
    if (err) return next(error500);
    if (!data) return next(error404);
    return res.json(data);
  });
});

router.post('/departments', (req, res, next) => {
  const { name }: { name: string | undefined } = req.body;
  if (name) {
    req.db.collection('departments').insertOne({ name }, (err) => {
      if (err) return next(error500);
      return res.status(200).send('OK');
    });
  }
  if (!name) next(error400);
});

router.put('/departments/:id', (req, res, next) => {
  const { name }: { name: string | undefined } = req.body;
  if (!name) {
    return next(error400);
  }
  const query = { _id: new ObjectId(req.params.id) };
  const dataToEdit = req.db.collection('departments').findOne(query, (err, data) => {
    if (err) return next(error500);
    if (!data) return next(error404);
    if (data) {
      req.db.collection('departments').updateOne(query, { $set: { name: name } }, (err) => {
        if (err) next(error500);
      });
      return res.status(200).send('OK');
    }
  });
});

router.delete('/departments/:id', (req, res, next) => {
  const query = { _id: new ObjectId(req.params.id) };
  const dataToEdit = req.db.collection('departments').findOne(query, (err, data) => {
    if (err) return next(error500);
    if (!data) return next(error404);
    if (data) {
      req.db.collection('departments').deleteOne(query, (err) => {
        if (err) return next(error500);
      });
      return res.status(200).send('OK');
    }
  });
});

export default router;
