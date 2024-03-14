const request = require('supertest');
let server;

beforeAll((done) => {
    const app = require('../monitoring'); // Assurez-vous que ce chemin est correct
    server = app.listen(3002, done);
});

afterAll((done) => {
    server.close(done);
});

describe('GET /login', () => {
    it('responds with expected HTTP status code', async () => {
        const response = await request(server).get('/');
        expect(response.statusCode).toBe(200); // Assurez-vous que la route répond correctement
    });
});

describe('GET /dashboard', () => {
    it('responds with expected HTTP status code', async () => {
        const response = await request(server).get('/dashboard');
        expect(response.statusCode).toBe(200);
    });
});

describe('GET /statistics', () => {
    it('responds with expected HTTP status code', async () => {
        const response = await request(server).get('/statistics');
        expect(response.statusCode).toBe(200);
    });
});

describe('GET /users', () => {
    it('responds with expected HTTP status code', async () => {
        const response = await request(server).get('/users');
        expect(response.statusCode).toBe(200);
    });
});

describe('GET /ticket/:ticketId', () => {
    it('responds with expected HTTP status code', async () => {
        const response = await request(server).get('/ticket/1');
        expect(response.statusCode).toBe(200);
    });
});

describe('GET /user/:userId', () => {
    it('responds with expected HTTP status code', async () => {
        const response = await request(server).get('/user/1');
        expect(response.statusCode).toBe(200);
    });
});