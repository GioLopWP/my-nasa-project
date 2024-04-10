const request = require('supertest');
const app = require('../../app');
const { mongoConnect, mongoDisconnect } = require('../../services/mongo');
const api = require('../api');
const { loadPlanetsData } = require('../../models/planets.model');

const apiVersion = '/v1';

describe('Launches API', () => {
  beforeAll(async () => {
    await mongoConnect();
    await loadPlanetsData();
  });

  afterAll(async () => {
    await mongoDisconnect();
  });

  describe('Test GET /launches', () => {
    it('should respond with 200 success', async () => {
      const response = await request(app)
        .get(`${apiVersion}/launches`)
        .expect('Content-Type', /json/)
        .expect(200);
    });
  });
  
  describe('Test POST /launches', () => {
    const dateStr = 'January 4, 2028'; 
    const launchDate = new Date(dateStr)
    const sendDataNoDate = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1701-D',
      target: 'Kepler-62 f',
    }
  
    it('should respond with 201 created', async () => {
      const { body } = await request(app)
        .post(`${apiVersion}/launches`)
        .send({ ...sendDataNoDate, launchDate:dateStr })
        .expect('Content-Type', /json/)
        .expect(201);
      
      expect(body).toMatchObject({
        ...sendDataNoDate,
        launchDate: launchDate.toISOString()
      })
    });
  
    it('should catch missing required properties', async () => {
      const { body } = await request(app)
        .post(`${apiVersion}/launches`)
        .send(sendDataNoDate)
        .expect('Content-Type', /json/)
        .expect(400);
  
      expect(body).toStrictEqual({
        error: "Missing required launch property"
      })
    })
  
    it('should catch invalid dates', async() => {
      const { body } = await request(app)
        .post(`${apiVersion}/launches`)
        .send({ ...sendDataNoDate, launchDate: 'asdasd' })
        .expect('Content-Type', /json/)
        .expect(400);
  
      expect(body).toStrictEqual({
        error: "Invalid launch date"
      })
    })
  });
});

