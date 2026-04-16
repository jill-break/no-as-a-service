const request = require('supertest');
const { app, generateReason } = require('./index');

describe('GET /no', () => {
  it('should return a 200 OK and a valid rejection reason', async () => {
    const res = await request(app).get('/no');
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('reason');
    expect(typeof res.body.reason).toBe('string');
    expect(res.body.reason.length).toBeGreaterThan(0);
  });
});

describe('generateReason', () => {
  it('should return a valid reason from a single-element array', () => {
    const mockReasons = ["I'm telling you no."];
    const result = generateReason(mockReasons);
    expect(result).toBe(mockReasons[0]);
  });

  it('should return a reason that exists in the provided array', () => {
    const mockReasons = ["No.", "Nope.", "Absolutely not."];
    const result = generateReason(mockReasons);
    expect(mockReasons).toContain(result);
  });
});

describe('GET /no/:id', () => {
  it('should return a specific reason for a valid ID', async () => {
    const res = await request(app).get('/no/0');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('reason');
    expect(typeof res.body.reason).toBe('string');
    expect(res.body.reason.length).toBeGreaterThan(0);
  });

  it('should return 404 for an out-of-bounds ID', async () => {
    const res = await request(app).get('/no/99999');

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 404 for a non-numeric ID', async () => {
    const res = await request(app).get('/no/abc');

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('error');
  });
});
