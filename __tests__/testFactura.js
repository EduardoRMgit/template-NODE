const request = require('supertest');
const express = require('express');
const cors = require('cors');
const { Factura } = require('../models');
const router = require('../routes/facturaRoutes'); 
const app = express();

app.use(cors());
app.use(express.json());
app.use(router);



describe('API FACTURAS', () => {
  let findAllOriginal;

  beforeAll(() => {
    findAllOriginal = Factura.findAll;
  });

  afterEach(() => {
    Factura.findAll = findAllOriginal;
  });

  //======================GET=====================

  it('GET /api/v1/facturas/ debe retornar una lista de facturas', async () => {
    const response = await request(app).get('/api/v1/facturas/');
    expect(response.status).toBe(200);

    expect(Array.isArray(response.body)).toBe(true);

  });

  it('GET /api/v1/facturas/ debe manejar errores correctamente', async () => {
    Factura.findAll = jest.fn(() => {
      throw new Error('Simulated error');
    });

    const response = await request(app).get('/api/v1/facturas/');

    expect(response.status).toBe(500);
  });

    //======================GET:ID=====================

  it('GET /api/v1/facturas/:idFactura debe retornar una factura existente', async () => {
    const response = await request(app).get('/api/v1/facturas/1/'); 
    expect(response.status).toBe(200); 
    expect(response.body).toHaveProperty('idFactura');
  });

  it('GET /api/v1/facturas/:idFactura debe manejar una factura no encontrado', async () => {
    const response = await request(app).get('/api/v1/facturas/999'); 
    expect(response.status).toBe(404);
  });

     //======================POST=====================

  it('POST /api/v1/facturas/ debe crear una nueva factura', async () => {
    const newFactura = {
      idFactura: 999,
      idMesero: 1,
      mesa: 1,
      subTotal: 100.0,
      total: 115.0
    };

    const response = await request(app)
      .post('/api/v1/facturas/')
      .send(newFactura);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('idFactura', 999);
  });

  //======================PUT=====================

    it('PUT /api/v1/facturas/:idFactura debe actualizar un factura existente', async () => {
      const updatedFactura = {
        idMesero: 1,
        mesa: 1,
        subTotal: 200.0,
        total: 215.0
      };
  
      const response = await request(app)
        .put('/api/v1/facturas/999') 
        .send(updatedFactura);
  
      expect(response.status).toBe(200);
    });

  //======================DELETE=====================

  it('DELETE /api/v1/facturas/:idFactura debe eliminar una factura existente', async () => {
    const response = await request(app).delete('/api/v1/facturas/999'); // Cambia el 1 por un idMesero válido
    expect(response.status).toBe(200);
  });
  

});
