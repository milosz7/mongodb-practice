import chai, { expect, request } from 'chai';
import chaiHttp from 'chai-http';
import { describe } from 'mocha';
import { server } from '../../../server';
import Department from '../../../models/departments.model';

chai.use(chaiHttp);

describe('Department PUT requests', () => {
  before(async () => {
    await Department.insertMany([
      { name: 'department-1', _id: '630e1adbc6a7e02950e660f6' },
      { name: 'department-2', _id: '630e1adbc6a7e02950e660f5' },
    ]);
  });
  it('Should edit data properly', async () => {
    const { status, body }: { body: typeof Department; status: number } = await request(server).put(
      '/api/departments/630e1adbc6a7e02950e660f6'
    ).send({name: 'edited-dep'});
    const editedData = await Department.findOne({name: 'edited-dep'});
    expect(editedData).to.contain({name: 'edited-dep'});
    expect(status).to.eq(200);
  });
  after(async () => {
    await Department.deleteMany({});
  });
});
