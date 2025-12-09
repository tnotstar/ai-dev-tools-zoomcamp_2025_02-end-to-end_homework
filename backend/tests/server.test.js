const request = require('supertest');
const { app, server, io } = require('../server');
const Client = require('socket.io-client');


describe('Backend API Tests', () => {
  beforeAll((done) => {
    server.listen(0, () => {
      done();
    });
  });

  afterAll((done) => {
    io.close();
    server.close(done);
  });

  describe('GET /health', () => {
    it('should return 200 OK', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status', 'ok');
    });
  });

  describe('POST /api/rooms', () => {
    it('should create a new room and return 201', async () => {
      const res = await request(app).post('/api/rooms');
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('roomId');
      expect(res.body).toHaveProperty('url');
    });
  });

  describe('Socket.io Connection', () => {
    let clientSocket;

    beforeEach((done) => {
      const addr = server.address();
      const port = addr.port;
      clientSocket = new Client(`http://localhost:${port}`);
      clientSocket.on('connect', done);
    });

    afterEach(() => {
      if (clientSocket.connected) {
        clientSocket.disconnect();
      }
      clientSocket.close();
    });

    it('should connect to the websocket server', (done) => {
      expect(clientSocket.connected).toBe(true);
      done();
    });
  });
});
