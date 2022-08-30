import Employee from '../../models/employees.model';
import Department from '../../models/departments.model';
import { describe } from 'mocha';
import { expect } from 'chai';
import mongoose from 'mongoose';
import { DepartmentModel } from '../../models/departments.model';

const TEST_DB_URI = 'mongodb://localhost:27017/companyDBtests';

describe('Employee CRUD operations', () => {
  before(async () => {
    try {
      await mongoose.connect(TEST_DB_URI);
    } catch (e) {
      console.log(e);
    }
  });
  describe('READ operations', () => {
    before(async () => {
      await Employee.insertMany([
        { firstName: 'John', lastName: 'Doe', department: new mongoose.Types.ObjectId() },
        { firstName: 'Mike', lastName: 'Lewis', department: new mongoose.Types.ObjectId() },
        { firstName: 'Annie', lastName: 'Smith', department: new mongoose.Types.ObjectId() },
      ]);
    });
    it('Should read a document properly with findOne method', async () => {
      const sampleDocument = await Employee.findOne({ firstName: 'John' });
      expect(sampleDocument?.firstName).to.eq('John');
    });
    it('Should read multiple documents properly with findMany method', async () => {
      const documentsData = await Employee.find({});
      const expectedLength = 3;
      expect(documentsData).to.have.lengthOf(expectedLength);
    });
    after(async () => {
      await Employee.deleteMany({});
    });
  });
  describe('CREATE operations', () => {
    it('Should save documents properly', async () => {
      const newEmployee = new Employee({
        firstName: 'John',
        lastName: 'Doe',
        department: new mongoose.Types.ObjectId(),
      });
      await newEmployee.save();
      expect(newEmployee.isNew).to.be.false;
    });
    after(async () => {
      await Employee.deleteMany({});
    });
  });
  describe('UPDATE operations', () => {
    beforeEach(async () => {
      await Employee.insertMany([
        { firstName: 'John', lastName: 'Doe', department: new mongoose.Types.ObjectId() },
        { firstName: 'Mike', lastName: 'Lewis', department: new mongoose.Types.ObjectId() },
        { firstName: 'Annie', lastName: 'Smith', department: new mongoose.Types.ObjectId() },
      ]);
    });
    it('Should update data correctly using updateOne method', async () => {
      await Employee.updateOne({ firstName: 'John' }, { firstName: 'Theo', lastName: 'Parker' });
      const editedEmployee = await Employee.findOne({ firstName: 'Theo', lastName: 'Parker' });
      expect(editedEmployee).to.not.be.null;
    });
    it('Should update data correctly using save method', async () => {
      const employeeToEdit = await Employee.findOne({ firstName: 'John' });
      employeeToEdit!.firstName = 'Peter';
      employeeToEdit!.lastName = 'Griffin';
      await employeeToEdit!.save();
      const editedEmployee = await Employee.findOne({ firstName: 'Peter', lastName: 'Griffin' });
      expect(editedEmployee).to.exist;
    });
    it('Should update multiple documents correctly using updateMany method', async () => {
      await Employee.updateMany({}, { firstName: 'Homer', lastName: 'Simpson' });
      const editedData = await Employee.find({ firstName: 'Homer', lastName: 'Simpson' });
      const expectedLength = 3;
      expect(editedData).to.have.lengthOf(expectedLength);
    });
    afterEach(async () => {
      await Employee.deleteMany({});
    });
  });
  describe('DELETE operations', () => {
    beforeEach(async () => {
      await Employee.insertMany([
        { firstName: 'John', lastName: 'Doe', department: new mongoose.Types.ObjectId() },
        { firstName: 'Mike', lastName: 'Lewis', department: new mongoose.Types.ObjectId() },
        { firstName: 'Annie', lastName: 'Smith', department: new mongoose.Types.ObjectId() },
      ]);
    });
    it('Should delete data correctly using deleteOne method', async () => {
      await Employee.deleteOne({ firstName: 'John' });
      const deletedDataQuery = await Employee.findOne({ firstName: 'John' });
      expect(deletedDataQuery).to.be.null;
    });
    it('Should delete data correctly using delete method', async () => {
      const dataToRemove = await Employee.findOne({ firstName: 'John' });
      dataToRemove!.delete();
      const removedDataQuery = await Employee.findOne({ firstName: 'John' });
      expect(removedDataQuery).to.be.null;
    });
    it('Should delete data correctly using delteMany method', async () => {
      await Employee.deleteMany({});
      const removedDataQuery = await Employee.find({});
      expect(removedDataQuery).to.be.empty;
    });
    afterEach(async () => {
      await Employee.deleteMany({});
    });
  });
  describe('Data population tests', () => {
    before(async () => {
      const departmentOne = new Department({
        name: 'department-1',
        _id: new mongoose.Types.ObjectId(),
      });
      const departmentTwo = new Department({
        name: 'department-2',
        _id: new mongoose.Types.ObjectId(),
      });
      await departmentOne.save();
      await departmentTwo.save();
      await Employee.insertMany([
        { firstName: 'John', lastName: 'Doe', department: departmentOne._id },
        { firstName: 'Mike', lastName: 'Smith', department: departmentTwo._id },
      ]);
    });
    it('Should return correctly populated data using populate', async () => {
      const populatedData = await Employee.find({}).populate({path: 'department', model: Department});
      for (const document of populatedData) {
        expect(document.department).to.be.an('object').to.have.property('name');
      }
    })
    after(async () => {
      await Department.deleteMany({});
      await Employee.deleteMany({});
    })
  });
  after(async () => {
    for (const key in mongoose.models) delete mongoose.models[key];
  });
});
