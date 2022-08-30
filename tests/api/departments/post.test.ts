import chai, { expect, request } from 'chai';
import chaiHttp from 'chai-http';
import { describe } from 'mocha';
import { server } from '../../../server';
import Department from '../../../models/departments.model';

chai.use(chaiHttp);

describe('Department POST requests', () => {
  it('Should properly post new data', async () => {
    const { status, text }: { status: number, text: string } = await request(server)
      .post('/api/departments')
      .send({ name: 'test-department' });
    const postedData = await Department.findOne({ name: 'test-department' });
    expect(text).to.eq('OK');
    expect(status).to.eq(200);
    expect(postedData).to.include({ name: 'test-department' });
  });
  after(async () => {
    await Department.deleteMany({});
  });
});
