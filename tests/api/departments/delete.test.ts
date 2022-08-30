import chai, { expect, request } from 'chai';
import chaiHttp from 'chai-http';
import { describe } from 'mocha';
import { server } from '../../../server';
import Department from '../../../models/departments.model';

chai.use(chaiHttp);

describe('Department DELETE requests', () => {
  before(async () => {
    await new Department({ name: 'department-1', _id: '630e1adbc6a7e02950e660f6' }).save();
  });
  it('Should delete data properly', async () => {
    const { body, status }: {body: typeof Department, status: number} = await request(server).delete(
      '/api/departments/630e1adbc6a7e02950e660f6'
    );
    const deletedData = await Department.findOne({name: 'department-1'});
    expect(status).to.eq(200)
    expect(deletedData).to.be.null;
    expect(body).to.contain({ name: 'department-1', _id: '630e1adbc6a7e02950e660f6' });
  });
});
