import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import server from '../index';
import countries from '../configs/country';

chai.use(chaiHttp);
chai.should();

describe('countries', () => {
  describe('GET /api/countries', () => {
    it('returns all countries', async done => {
      let resp = await chai
        .request(server)
        .get('/api/countries')
        .auth('username', 'password');
      expect(resp).to.have.status(200);
      resp.body.should.be.a('object');
      done();
    });
  });

  describe('PUT /api/countries/:code', () => {
    const param = {
      population: 123456,
      name: 'SYRIAN ARAB REPUBLIC',
      code: 'syr',
    };
    it('returns 200 status', async done => {
      const code = 'syr';
      let resp = await chai
        .request(server)
        .put(`/api/countries/${code}`)
        .send(param)
        .auth('username', 'password');
      expect(resp).to.have.status(200);
      done();
    });
    it('returns 404 error when country code is not found', async done => {
      const code = 'lorem';
      let resp = await chai
        .request(server)
        .put(`/api/countries/${code}`)
        .send(param)
        .auth('username', 'password');
      expect(resp).to.have.status(404);
      done();
    });
  });

  describe('DELETE /api/countries/:code', () => {
    it('returns 200 status', async done => {
      const randomIdx = Math.floor(Math.random() * 200) + 1;

      let resp = await chai
        .request(server)
        .delete(`/api/countries/${countries[randomIdx].code}`)
        .auth('username', 'password');
      expect(resp).to.have.status(200);
      done();
    });
    it('returns 404 error when country code is not found', async done => {
      const code = 'lorem';

      let resp = await chai
        .request(server)
        .delete(`/api/countries/${code}`)
        .auth('username', 'password');
      expect(resp).to.have.status(404);
      done();
    });
  });
});