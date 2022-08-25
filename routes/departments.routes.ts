import express from 'express';
import departmentMethods from '../methods/departments.methods';

const router = express.Router();

router.get('/departments', departmentMethods.getAll);

router.get('/departments/random', departmentMethods.getRandom);

router.get('/departments/:id', departmentMethods.getById);

router.post('/departments', departmentMethods.postNew);

router.put('/departments/:id', departmentMethods.edit);

router.delete('/departments/:id', departmentMethods.delete);

export default router;
