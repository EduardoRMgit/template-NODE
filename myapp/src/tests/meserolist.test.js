import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { default as axios } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import MeseroList from '../components/meserolist'; 
import '@testing-library/jest-dom/extend-expect';

console.error = jest.fn(); // Suprimir los mensajes de error de la consola

describe('MeseroList Component', () => {
  let mockAxios;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.reset();
  });

  it('fetches and displays a list of meseros', async () => {
    const mockMeseros = [
      { idMesero: 1, nombre: 'Juan', apellidos: 'Pérez' },
      { idMesero: 2, nombre: 'María', apellidos: 'López' },
    ];

    mockAxios.onGet('http://localhost:4000/api/v1/meseros').reply(200, mockMeseros);

    const { getByText } = render(<MeseroList />);

    await waitFor(() => {
      mockMeseros.forEach((mesero) => {
        const meseroNombre = getByText(mesero.nombre);
        const meseroApellidos = getByText(mesero.apellidos);
        expect(meseroNombre).toBeInTheDocument();
        expect(meseroApellidos).toBeInTheDocument();
      });
    });
  });


 




});