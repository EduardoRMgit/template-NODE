const request = require('supertest');
const express = require('express');
const cors = require('cors');
const { Cliente } = require('../models');
const router = require('../routes/clienteRoutes'); 
const app = express();

app.use(cors());
app.use(express.json());
app.use(router);



describe('API CLIENTES', () => {
  let findAllOriginal;

  beforeAll(() => {
    findAllOriginal = Cliente.findAll;
  });

  afterEach(() => {
    Cliente.findAll = findAllOriginal;
  });

  //======================GET=====================

  it('GET /api/v1/clientes/ debe retornar una lista de clientes', async () => {
    const response = await request(app).get('/api/v1/clientes/');
    expect(response.status).toBe(200);

    expect(Array.isArray(response.body)).toBe(true);

  });

  it('GET /api/v1/clientes/ debe manejar errores correctamente', async () => {
    Cliente.findAll = jest.fn(() => {
      throw new Error('Simulated error');
    });

    const response = await request(app).get('/api/v1/clientes/');

    expect(response.status).toBe(500);
  });

    //======================GET:ID=====================

  it('GET /api/v1/clientes/:idCliente debe retornar un cliente existente', async () => {
    const response = await request(app).get('/api/v1/clientes/1/'); 
    expect(response.status).toBe(200); 
    expect(response.body).toHaveProperty('idCliente');
  });

  it('GET /api/v1/clientes/:idCliente debe manejar un cliente no encontrado', async () => {
    const response = await request(app).get('/api/v1/clientes/999'); 
    expect(response.status).toBe(404);
  });

     //======================POST=====================

  it('POST /api/v1/clientes/ debe crear un nuevo cliente', async () => {
    const newCliente = {
      idCliente: 999,
      nombre: "Cliente",
      apellidos: "Apellidos",
      rfc: "123456789ABC1",
      calle: "Calle1",
      numExt: "123",
      colonia: "Colonia",
      municipio: "Municipio",
      estado: "Estado",
      zipCode: "12345",
      montoTotal: 100.0,
      idFactura: 4
    };

    const response = await request(app)
      .post('/api/v1/clientes/')
      .send(newCliente);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('idCliente', 999);
  });

  //======================PUT=====================

    it('PUT /api/v1/clientes/:idCliente debe actualizar un cliente existente', async () => {
      const updatedCliente = {
        nombre: "NEWCliente",
        apellidos: "NEWApellidos",
        rfc: "123456789ABC2",
        calle: "NEWCalle1",
        numExt: "456",
        colonia: "NEWColonia",
        municipio: "NEWMunicipio",
        estado: "Estado",
        zipCode: "12345",
        montoTotal: 100.0,
        idFactura: 1
      };
  
      const response = await request(app)
        .put('/api/v1/clientes/999') 
        .send(updatedCliente);
  
      expect(response.status).toBe(200);
    });

  //======================DELETE=====================

  it('DELETE /api/v1/clientes/:idCliente debe eliminar un cliente existente', async () => {
    const response = await request(app).delete('/api/v1/clientes/999'); // Cambia el 1 por un idMesero válido
    expect(response.status).toBe(200);
  });
  

});
