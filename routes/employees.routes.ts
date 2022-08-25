import express from 'express';
import employeeMethods from '../methods/employees.methods';

const router = express.Router();

router.get('/employees', employeeMethods.getAll);

router.get('/employees/random', employeeMethods.getRandom);

router.get('/employees/:id', employeeMethods.getById);

router.post('/employees', employeeMethods.addNew);

router.put('/employees/:id', employeeMethods.edit);

router.delete('/employees/:id', employeeMethods.delete);

export default router;
