const request = require('supertest');
const express = require('express');
const cors = require('cors');
const { Mesero } = require('../models');
const router = require('../routes/meseroRoutes'); 
const app = express();

app.use(cors());
app.use(express.json());
app.use(router);



describe('API Mesero', () => {
  let findAllOriginal;

  beforeAll(() => {
    findAllOriginal = Mesero.findAll;
  });

  afterEach(() => {
    Mesero.findAll = findAllOriginal;
  });

  //======================GET=====================
  it('GET /api/v1/meseros/ debe retornar una lista de meseros', async () => {
    const response = await request(app).get('/api/v1/meseros/');
    expect(response.status).toBe(200);

    expect(Array.isArray(response.body)).toBe(true);

  });

  it('GET /api/v1/meseros/ debe manejar errores correctamente', async () => {
    Mesero.findAll = jest.fn(() => {
      throw new Error('Simulated error');
    });

    const response = await request(app).get('/api/v1/meseros/');

    expect(response.status).toBe(500);
  });

  //======================GET ID=====================

  it('GET /api/v1/meseros/:idMesero debe retornar un mesero existente', async () => {
    const response = await request(app).get('/api/v1/meseros/1/'); 
    expect(response.status).toBe(200); 
    expect(response.body).toHaveProperty('idMesero');
  });

  it('GET /api/v1/meseros/:idMesero debe manejar un mesero no encontrado', async () => {
    const response = await request(app).get('/api/v1/meseros/1000'); 
    expect(response.status).toBe(404);
  });

  //======================POST=====================

  it('POST /api/v1/meseros/ debe crear un nuevo mesero', async () => {
    const newMesero = {
      idMesero: 999, 
      nombre: 'Nombre',
      apellidos: 'Apellidos',
    };

    const response = await request(app)
      .post('/api/v1/meseros/')
      .send(newMesero);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('idMesero', 999);
  });

    //======================PUT=====================

    it('PUT /api/v1/meseros/:idMesero debe actualizar un mesero existente', async () => {
      const updatedMesero = {
        nombre: 'Nuevo Nombre',
        apellidos: 'Nuevos Apellidos',
      };
  
      const response = await request(app)
        .put('/api/v1/meseros/999') 
        .send(updatedMesero);
  
      expect(response.status).toBe(200);
    });

  //======================DELETE=====================

  it('DELETE /api/v1/meseros/:idMesero debe eliminar un mesero existente', async () => {
    const response = await request(app).delete('/api/v1/meseros/999'); // Cambia el 1 por un idMesero válido

    expect(response.status).toBe(200);
  });
  

});
