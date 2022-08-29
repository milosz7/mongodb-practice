import { describe, after } from 'mocha';
import Department from '../departments.model';
import { expect } from 'chai';
import mongoose from 'mongoose';

describe('Department model', () => {
  it('Should throw an error if the name argument is not specified', () => {
    const newDepartment = new Department({});
    newDepartment.validate((err) => {
      expect(err).to.exist;
    });
  });
  it('Should throw an error if name is not a string', () => {
    const cases = [[], {}];
    for (const elem of cases) {
      const newDepartment = new Department({ name: elem });
      newDepartment.validate((err) => {
        expect(err).to.exist;
      });
    }
  });
  it('Should throw an error if name is too long or too short', () => {
    const cases = ['ab', 'a', 'testNameThatExceedsTheLimit'];
    for (const elem of cases) {
      const newDepartment = new Department({ name: elem });
      newDepartment.validate((err) => {
        expect(err).to.exist;
      });
    }
  });
  it('Should throw an error if name is a number or a string made of digits', () => {
    const cases = [1234452, '1234367', 998840];
    for (const elem of cases) {
      const newDepartment = new Department({name: elem});
      newDepartment.validate(err => {
        expect(err).to.exist;
      })
    }
  })
  it('Should not throw an error if the name data is correct', () => {
    const cases = ['Mike', 'Karen', 'Steve'];
    for (const elem of cases) {
      const newDepartment = new Department({ name: elem });
      newDepartment.validate((err) => {
        expect(err).to.be.null;
      });
    }
  });
  after(() => {
    for (const key in mongoose.models) {
      delete mongoose.models[key];
    }
  });
});
