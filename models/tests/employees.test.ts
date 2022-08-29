import Employee from '../employees.model';
import mongoose from 'mongoose';
import { describe } from 'mocha';
import { expect } from 'chai';

describe('Employee model', () => {
  it('Should throw an error when no arguments passed', () => {
    const newEmployee = new Employee({});
    newEmployee.validate((err) => {
      expect(err).to.exist;
    });
  });
  it('Should throw an error if any field is incorrect', () => {
    const cases = [
      { firstName: [], lastName: 'Doe', department: new mongoose.Types.ObjectId() },
      { firstName: 'John', lastName: {}, department: new mongoose.Types.ObjectId() },
      { firstName: 'John', lastName: 'Doe', department: 123 },
    ];
    for (const elem of cases) {
      const newEmployee = new Employee(elem);
      newEmployee.validate((err) => {
        expect(err).to.exist;
      });
    }
  });
  it('Should throw an error if firstName or lastName are numbers', () => {
    const cases = [
      { firstName: 12323, lastName: 45701, department: new mongoose.Types.ObjectId() },
      { firstName: 'John', lastName: 12315, department: new mongoose.Types.ObjectId() },
      { firstName: 99863, lastName: 'Smith', department: new mongoose.Types.ObjectId() },
    ];
    for (const elem of cases) {
      const newEmployee = new Employee(elem);
      newEmployee.validate((err) => {
        expect(err).to.exist;
      });
    }
  });
  it('Should throw an error if any of the fields is missing', () => {
    const cases = [
      { firstName: 'John', lastName: 'Doe' },
      { firstName: 'John', department: new mongoose.Types.ObjectId() },
      { lastName: 'Doe', department: new mongoose.Types.ObjectId() },
    ];
    for (const elem of cases) {
      const newEmployee = new Employee(elem);
      newEmployee.validate((err) => {
        expect(err).to.exist;
      });
    }
  });
  it('Should not throw an error if the argument matches the schema', () => {
    const cases = [
      { firstName: 'Mike', lastName: 'Smith', department: new mongoose.Types.ObjectId() },
      { firstName: 'Ann', lastName: 'Doe', department: new mongoose.Types.ObjectId() },
      { firstName: 'Katie', lastName: 'White', department: new mongoose.Types.ObjectId() },
    ];
    for (const elem of cases) {
      const newEmployee = new Employee(elem);
      newEmployee.validate((err) => {
        expect(err).to.be.null;
      });
    }
  });
  afterEach(() => {
    for (const key in mongoose.models) {
      delete mongoose.models[key];
    }
  });
});
