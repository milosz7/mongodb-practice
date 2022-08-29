import Department from '../models/departments.model';
import { expect } from 'chai';
import { describe } from 'mocha';
import mongoose from 'mongoose';

const TEST_DB_URI = 'mongodb://localhost:27017/companyDBtests';

describe('Department CRUD operations', () => {
  before(async () => {
    try {
      await mongoose.connect(TEST_DB_URI);
    } catch (e) {
      console.log(e);
    }
  });
  describe('READ operations', () => {
    before(async () => {
      await Department.insertMany([
        { name: 'department-1' },
        { name: 'department-2' },
        { name: 'department-3' },
      ]);
    });
    it('Should return whole collection data using find method', async () => {
      const expectedLength = 3;
      expect(await Department.find({})).to.have.length(expectedLength);
    });
    it('Should return a single document using findOne method', async () => {
      const singleDocument = await Department.findOne({ name: { $eq: 'department-1' } });
      expect(singleDocument).to.be.an('object');
      expect(singleDocument).to.have.property('_id');
      expect(singleDocument!.name).to.eq('department-1');
    });
    after(async () => {
      await Department.deleteMany({});
    });
  });
  describe('CREATE operations', () => {
    it('Should save documents properly', async () => {
      const documentToSave = new Department({ name: 'department-save' });
      await documentToSave.save();
      const savedDocument = await Department.findOne({ name: { $eq: 'department-save' } });
      expect(savedDocument?.name).to.eq('department-save');
    });
    after(async () => {
      await Department.deleteMany({});
    });
  });
  describe('UPDATE operations', () => {
    beforeEach(async () => {
      await Department.insertMany([
        { name: 'department-1' },
        { name: 'department-2' },
        { name: 'department-3' },
      ]);
    });
    it('Should edit a documents propertly using updateOne method', async () => {
      const updateResult = await Department.updateOne(
        { name: { $eq: 'department-1' } },
        { name: 'edited' }
      );
      const updatedData = await Department.findOne({ name: { $eq: 'edited' } });
      expect(updateResult.modifiedCount).to.eq(1);
      expect(updatedData?.name).to.eq('edited');
    });
    it('Should edit a document properly using save method', async () => {
      const dataToEdit = await Department.findOne({ name: { $eq: 'department-1' } });
      dataToEdit!.name = 'edited';
      await dataToEdit!.save();
      const editedData = await Department.findOne({ name: { $eq: 'edited' } });
      expect(editedData).to.not.be.null;
    });
    it('Should edit multiple documents properly with updateMany', async () => {
      await Department.updateMany({}, { name: 'edited' });
      const expectedDocumentsNumber = 3;
      const editedData = await Department.find({ name: { $eq: 'edited' } });
      expect(editedData).to.have.lengthOf(expectedDocumentsNumber);
    });
    afterEach(async () => {
      await Department.deleteMany({});
    });
  });
  describe('DELETE operations', () => {
    beforeEach(async () => {
      await Department.insertMany([
        { name: 'department-1' },
        { name: 'department-2' },
        { name: 'department-3' },
      ]);
    });
    it('Should delete documents properly using deleteOne method', async () => {
      await Department.deleteOne({ name: { $eq: 'department-1' } });
      const deletedDocument = await Department.findOne({ name: { $eq: 'department-1' } });
      expect(deletedDocument).to.be.null;
    });
    it('Should delete documents properly using delete method', async () => {
      const documentToDelete = await Department.findOne({name: {$eq: 'department-1'}});
      await documentToDelete?.delete();
      const deletedDocument = await Department.findOne({name: {$eq: 'department-1'}});
      expect(deletedDocument).to.be.null;
    });
    it('Should delete multiple documents using deleteMany method', async () => {
      await Department.deleteMany({});
      const documentsData = await Department.find({});
      expect(documentsData).to.be.empty;
    })
    afterEach(async () => {
      await Department.deleteMany({});
    });
  });
  after(async () => {
    for (const key in mongoose.models) {
      delete mongoose.models[key];
    }
    await mongoose.connection.close();
  });
});
