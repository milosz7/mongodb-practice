import chai, { expect, request } from 'chai';
import chaiHttp from 'chai-http';
import { describe } from 'mocha';
import { server } from '../../../server';
import Department from '../../../models/departments.model';

chai.use(chaiHttp);

describe('Department GET requests', () => {
  before(async () => {
      await Department.insertMany([
        { name: 'department-1', _id: '630e1adbc6a7e02950e660f6' },
        { name: 'department-2', _id: '630e1adbc6a7e02950e660f5' },
      ]);
    }
  );
  it('Should return all departments data', async () => {
    const expectedLength = 2;
    const { body, status }: { body: typeof Department[]; status: number } = await request(
      server
    ).get('/api/departments/');
    expect(status).to.eq(200);
    expect(body).to.be.an('array').with.lengthOf(expectedLength);
    for (const document of body) {
      expect(document).to.have.property('name');
    }
  });
  it('Should return a department data with a specific id at /:id', async () => {
    const { body, status }: { body: typeof Department[] | null; status: number } = await request(
      server
    ).get('/api/departments/630e1adbc6a7e02950e660f6');
    expect(status).to.eq(200);
    expect(body).to.include({ name: 'department-1', _id: '630e1adbc6a7e02950e660f6' });
  });
  it('Should return a random department data at /random', async () => {
    const { body, status }: { body: typeof Department[] | null; status: number } = await request(
      server
    ).get('/api/departments/random');
    expect(status).to.eq(200);
    expect(body).to.be.an('object').and.contain.keys('name', '_id')
  });
  after(async () => {
    await Department.deleteMany({});
  });
});
