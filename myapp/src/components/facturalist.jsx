import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Table } from 'react-bootstrap';
import axios from 'axios';


const FacturaList = () => {
const [facturas, setFacturas] = useState([]);
const [showModal, setShowModal] = useState(false);

const [idMesero, setIdMesero] = useState();
const [mesa, setMesa] = useState();
const [subTotal, setSubTotal] = useState();
const [total, setTotal] = useState();



const [showCannotDeleteModal, setShowCannotDeleteModal] = useState(false);
const [cannotDeleteMessage, setCannotDeleteMessage] = useState('');
const [selectedFactura, setSelectedFactura] = useState(null);
const [addFacturaError, setAddFacturaError] = useState(''); 




  const fetchFacturas = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/v1/facturas'); // Reemplaza 'URL_DEL_API' por la URL de tu API
      setFacturas(response.data);
    } catch (error) {
      console.error('Error al obtener las facturas:', error);
    }
  };

  useEffect(() => {
    // Al cargar el componente, inicia el temporizador para obtener los proveedores cada 5 segundos
    const timer = setInterval(fetchFacturas, 500);
    // Al desmontar el componente, limpia el temporizador
    return () => {
      clearInterval(timer);
    };
    }, []);

    const handleAddFactura = async () => {
        try {
          const response = await axios.post('http://localhost:4000/api/v1/facturas/', {
            idMesero,
            mesa,
            subTotal,
            total,
          });
          if (response.status === 201) {
            fetchFacturas();
            handleCloseModal();
          }
        } catch (error) {
          console.error('Error al agregar Factura:', error);
          setAddFacturaError('No se pudo agregar la factura. Intente con otro IdMesero.');
        }
      };

    const handleDelete = async (idFactura) => {
      try {
        const response = await axios.delete(`http://localhost:4000/api/v1/facturas/${idFactura}`);
        if (response.status === 200) {
          fetchFacturas();
        }
      } catch (error) {
        if (error.response && error.response.status === 500) {
          setShowCannotDeleteModal(true);
          setCannotDeleteMessage('No se puede eliminar la factura debido a restricciones de clave externa.');
        }
      }
    };
  

    const handleCloseModal = () => {
      setShowModal(false);
      setMesa();
      setSubTotal();
      setTotal();
    };


    const openDetailsModal = (factura) => {
        setSelectedFactura(factura);
    };
  

  return (
    <div>
      <br></br>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '0' }}>Facturas</h1>

        <Button variant="primary" style={{ marginLeft: '20px' }} onClick={() => setShowModal(true)}>
          Agregar Factura
        </Button>
      </div>
      <br></br>
      <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Factura</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {addFacturaError && <p style={{ color: 'red' }}>{addFacturaError}</p>}
        <Form>
          <Form.Group controlId="idmesero">
            <Form.Label>IdMesero</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese el ID del mesero"
              value={idMesero}
              onChange={(e) => setIdMesero(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="mesa">
            <Form.Label>Número de Mesa</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese el número de mesa"
              value={mesa}
              onChange={(e) => setMesa(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="subotal">
            <Form.Label>Subtotal</Form.Label>
            <Form.Control
              type="number"
              placeholder="Ingrese el subtotal"
              value={subTotal}
              onChange={(e) => setSubTotal(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="total">
            <Form.Label>Total</Form.Label>
            <Form.Control
              type="number"
              placeholder="Ingrese el total"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleAddFactura}>
          Agregar
        </Button>
      </Modal.Footer>
    </Modal>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>idFactura</th>
            <th>Fecha</th>
            <th>idMesero</th>
            <th>Mesa</th>
            <th>Subtotal</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {facturas.map((factura) => (
            <tr key={factura.idFactura}>
            <td style={{ textAlign: 'center' }}>{factura.idFactura}</td>
            <td style={{ textAlign: 'center' }}>{factura.fecha}</td>
            <td style={{ textAlign: 'center' }}>{factura.idMesero}</td>
            <td style={{ textAlign: 'center' }}>{factura.mesa}</td>
            <td style={{ textAlign: 'center' }}>{factura.subTotal}</td>
            <td style={{ textAlign: 'center' }}>{factura.total}</td>
            <td style={{ textAlign: 'center' }}>
                <Button variant="info" style={{ marginRight: '10px' }} onClick={() => openDetailsModal(factura)}>
                  Ver Detalles
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    handleDelete(factura.idFactura);
                  }}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showCannotDeleteModal} onHide={() => setShowCannotDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>No se puede eliminar la factura</Modal.Title>
        </Modal.Header>
        <Modal.Body>{cannotDeleteMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCannotDeleteModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={selectedFactura !== null} onHide={() => setSelectedFactura(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles de la factura</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedFactura && (
            <div>
              <p>idFactura: {selectedFactura.idFactura}</p>
              <p>Fecha: {selectedFactura.fecha}</p>
              <p>idMesero: {selectedFactura.idMesero}</p>
              <p>Mesa: {selectedFactura.mesa}</p>
              <p>SubTotal: {selectedFactura.subTotal}</p>
              <p>Total: {selectedFactura.total}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSelectedFactura(null)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default FacturaList;