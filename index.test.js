const request = require('supertest');
const app = require('./index');

describe('GET /no', () => {
  it('should return a 200 OK and a valid rejection reason', async () => {
    const res = await request(app).get('/no');
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('reason');
    expect(typeof res.body.reason).toBe('string');
    expect(res.body.reason.length).toBeGreaterThan(0);
  });
});
