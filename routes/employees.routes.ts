import express from 'express';
import { ObjectId } from 'mongodb';
import { employeeData } from '../types/types';
import { error500, error400, error404 } from '../errors';

const router = express.Router();

router.get('/employees', (req, res, next) => {
  req.db
    .collection<employeeData>('employees')
    .find()
    .toArray((err, data) => {
      if (err) return next(error500);
      if (!data) return next(error404);
      return res.json(data);
    });
});

router.get('/employees/random', (req, res, next) => {
  req.db
    .collection<employeeData>('employees')
    .aggregate([{ $sample: { size: 1 } }])
    .toArray((err, data) => {
      if (err) return next(error500);
      if (!data) return next(error404);
      return res.json(...data!);
    });
});

router.get('/employees/:id', (req, res, next) => {
  const query = { _id: new ObjectId(req.params.id) };
  req.db.collection<employeeData>('employees').findOne(query, (err, data) => {
    if (err) return next(error500);
    if (!data) return next(error404);
    return res.json(data);
  });
});

router.post('/employees', (req, res, next) => {
  const {
    firstName,
    lastName,
    department,
  }: {
    firstName: string | undefined;
    lastName: string | undefined;
    department: string | undefined;
  } = req.body;
  if (firstName && lastName && department) {
    req.db
      .collection<employeeData>('employees')
      .insertOne({ firstName, lastName, department }, (err) => {
        if (err) return next(error500);
        return res.status(200).send('OK');
      });
  } else {
    return next(error400);
  }
});

router.put('/employees/:id', (req, res, next) => {
  const query = { _id: new ObjectId(req.params.id) };
  const {
    firstName,
    lastName,
    department,
  }: {
    firstName: string | undefined;
    lastName: string | undefined;
    department: string | undefined;
  } = req.body;
  if (firstName && lastName && department) {
    req.db.collection<employeeData>('employees').findOne(query, (err, data) => {
      if (err) return next(error500);
      if (!data) return next(error404);
      req.db
        .collection<employeeData>('employees')
        .updateOne(query, { $set: { firstName, lastName, department } }, (err) => {
          if (err) return next(error500);
          return res.status(200).send('OK');
        });
    });
  } else {
    return next(error400);
  }
});

router.delete('/employees/:id', (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };

  req.db.collection<employeeData>('employees');
});

export default router;
