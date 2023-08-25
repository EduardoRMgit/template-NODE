import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Table } from 'react-bootstrap';
import { default as axios } from 'axios';

const ClienteList = () => {
const [clientes, setClientes] = useState([]);
const [showModal, setShowModal] = useState(false);

const [nombre, setNombre] = useState('');
const [apellidos, setApellidos] = useState('');
const [rfc, setRFC] = useState('');
const [calle, setCalle] = useState('');
const [numExt, setNumExt] = useState('');
const [numInt, setNumInt] = useState(null);
const [colonia, setColonia] = useState('');
const [municipio, setMunicipio] = useState('');
const [estado, setEstado] = useState('');
const [zipCode, setZipCode] = useState('');
const [montoTotal, setMontoTotal] = useState(0.0);
const [idFactura, setIdFactura] = useState();


const [editingCliente, setEditingCliente] = useState(null);
const [editedNombre, setEditedNombre] = useState('');
const [editedApellidos, setEditedApellidos] = useState('');
const [editedRFC, setEditedRFC] = useState('');
const [editedCalle, setEditedCalle] = useState('');
const [editedNumExt, setEditedNumExt] = useState('');
const [editedNumInt, setEditedNumInt] = useState('');
const [editedColonia, setEditedColonia] = useState('');
const [editedMunicipio, setEditedMunicipio] = useState('');
const [editedEstado, setEditedEstado] = useState('');
const [editedZipCode, setEditedZipCode] = useState('');
const [editedMontoTotal, setEditedMontoTotal] = useState(0.0);
const [editedIdFactura, setEditedIdFactura] = useState('');



const [selectedCliente, setSelectedCliente] = useState(null);



const [showCannotDeleteModal, setShowCannotDeleteModal] = useState(false);
const [cannotDeleteMessage, setCannotDeleteMessage] = useState('');
const [addClienteError, setClienteError] = useState(''); 




  const fetchClientes = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/v1/clientes'); // Reemplaza 'URL_DEL_API' por la URL de tu API
      setClientes(response.data);
    } catch (error) {
      console.error('Error al obtener los clientes:', error);
    }
  };

  useEffect(() => {
    // Al cargar el componente, inicia el temporizador para obtener los proveedores cada 5 segundos
    const timer = setInterval(fetchClientes, 500);
    // Al desmontar el componente, limpia el temporizador
    return () => {
      clearInterval(timer);
    };
    }, []);

    const handleAddCliente = async () => {
        try {
          const response = await axios.post('http://localhost:4000/api/v1/clientes/', {
            nombre,
            apellidos,
            rfc,
            calle,
            numExt,
            numInt,
            colonia,
            municipio,
            montoTotal,
            idFactura,
            estado,
            zipCode
          });
          if (response.status === 201) {
            fetchClientes();
            handleCloseModal();
          }
        } catch (error) {
          console.error('Error al agregar Cliente:', error);
          setClienteError('No se pudo agregar el cliente. Llena bien los campos.');
        }
      };

    const handleDelete = async (idCliente) => {
      try {
        const response = await axios.delete(`http://localhost:4000/api/v1/clientes/${idCliente}`);
        if (response.status === 200) {
          fetchClientes();
        }
      } catch (error) {
        if (error.response && error.response.status === 500) {
          setShowCannotDeleteModal(true);
          setCannotDeleteMessage('No se puede eliminar el cliente debido a restricciones de clave externa.');
        }
      }
    };
  

    const handleCloseModal = () => {
      setShowModal(false);
      setNombre('');
      setApellidos('');
      setRFC('');
      setCalle('');
      setNumExt('');
      setNumInt('');
      setColonia('');
      setMunicipio('');
      setEstado('');
      setZipCode('');
      setMontoTotal();
      setIdFactura();
    };


    const openDetailsModal = (cliente) => {
        setSelectedCliente(cliente);
    };
  

    const handleModify = (cliente) => {
      setEditingCliente(cliente);
      setEditedNombre(cliente.nombre);
      setEditedApellidos(cliente.apellidos);
      setEditedRFC(cliente.rfc);
      setEditedCalle(cliente.calle);
      setEditedNumExt(cliente.numExt);
      setEditedNumInt(cliente.numInt || ''); // Manejar el caso de null
      setEditedColonia(cliente.colonia);
      setEditedMunicipio(cliente.municipio);
      setEditedEstado(cliente.estado);
      setEditedZipCode(cliente.zipCode);
      setEditedMontoTotal(cliente.montoTotal);
      setEditedIdFactura(cliente.idFactura);
      setShowModal(true); // Abre el modal de edición
    };
    

    const handleSaveEdit = async () => {
      try {
        const response = await axios.put(
          `http://localhost:4000/api/v1/clientes/${editingCliente.idCliente}`,
          {
            nombre: editedNombre,
            apellidos: editedApellidos,
            rfc: editedRFC,
            calle: editedCalle,
            numExt: editedNumExt,
            numInt: editedNumInt,
            colonia: editedColonia,
            municipio: editedMunicipio,
            estado: editedEstado,
            zipCode: editedZipCode,
            montoTotal: editedMontoTotal,
            idFactura: editedIdFactura,
          }
        );
    
        if (response.status === 200) {
          fetchClientes(); // Actualiza la lista de clientes
          handleCloseModal(); // Cierra el modal
        }
      } catch (error) {
        console.error('Error al modificar el cliente:', error);
      }
    };

  return (
    <div>
      <br></br>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '0' }}>Clientes</h1>

        <Button variant="primary" style={{ marginLeft: '20px' }} onClick={() => setShowModal(true)}>
          Agregar Cliente
        </Button>
      </div>
      <br></br>
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Cliente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {addClienteError && <p style={{ color: 'red' }}>{addClienteError}</p>}
        <Form>
        <Form.Group controlId="nombre">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese el nombre"
            value={editingCliente ? editedNombre : nombre}
            onChange={(e) => {
              const inputValue = e.target.value;
              if (/^[A-Za-z\s]*$/.test(inputValue)) {
                if (editingCliente) {
                  setEditedNombre(inputValue);
                } else {
                  setNombre(inputValue);
                }
              }
            }}
          />
        </Form.Group>

        <Form.Group controlId="apellidos">
          <Form.Label>Apellidos</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese los apellidos"
            value={editingCliente ? editedApellidos : apellidos}
            onChange={(e) => {
              const inputValue = e.target.value;
              if (/^[A-Za-z\s]*$/.test(inputValue)) {
                if (editingCliente) {
                  setEditedApellidos(inputValue);
                } else {
                  setApellidos(inputValue);
                }
              }
            }}
          />
        </Form.Group>

        <Form.Group controlId="rfc">
        <Form.Label>RFC</Form.Label>
        <Form.Control
            type="text"
            placeholder="Ingrese el RFC"
            value={editingCliente ? editedRFC : rfc}
            onChange={editingCliente ? (e) => setEditedRFC(e.target.value)  : (e) => setRFC(e.target.value)}
            maxLength={13} 
        />
        {rfc.length !== 13 && (
            <Form.Text className="text-danger">
            El RFC debe tener exactamente 13 caracteres.
            </Form.Text>
        )}
        </Form.Group>

      <Form.Group controlId="calle">
      <Form.Label>Calle</Form.Label>
      <Form.Control
        type="text"
        placeholder="Ingrese la calle"
        value={editingCliente ? editedCalle : calle}
        onChange={(e) => {
          const inputValue = e.target.value;
          if (/^[A-Za-z\s]*$/.test(inputValue)) {
            if (editingCliente) {
              setEditedCalle(inputValue);
            } else {
              setCalle(inputValue);
            }
          }
        }}
      />
    </Form.Group>

    <Form.Group controlId="numExt">
    <Form.Label>Número Exterior</Form.Label>
    <Form.Control
      type="text"
      placeholder="Ingrese el número exterior"
      value={editingCliente ? editedNumExt : numExt}
      onChange={(e) => {
        const inputValue = e.target.value;
        if (/^\d*$/.test(inputValue)) {
          if (editingCliente) {
            setEditedNumExt(inputValue);
          } else {
            setNumExt(inputValue);
          }
        }
      }}
    />
  </Form.Group>

          <Form.Group controlId="numInt">
            <Form.Label>Número Interior</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese el número interior"
              value={editingCliente ? editedNumInt : numInt}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (/^\d*$/.test(inputValue)) {
                  if (editingCliente) {
                    setEditedNumInt(inputValue);
                  } else {
                    setNumInt(inputValue);
                  }
                }
              }}
            />
          </Form.Group>

          <Form.Group controlId="colonia">
          <Form.Label>Colonia</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese la colonia"
            value={editingCliente ? editedColonia : colonia}
            onChange={(e) => {
              const inputValue = e.target.value;
              if (/^[A-Za-z\s]*$/.test(inputValue)) {
                if (editingCliente) {
                  setEditedColonia(inputValue);
                } else {
                  setColonia(inputValue);
                }
              }
            }}
          />
        </Form.Group>

        <Form.Group controlId="municipio">
          <Form.Label>Municipio</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese el municipio"
            value={editingCliente ? editedMunicipio : municipio}
            onChange={(e) => {
              const inputValue = e.target.value;
              if (/^[A-Za-z\s]*$/.test(inputValue)) {
                if (editingCliente) {
                  setEditedMunicipio(inputValue);
                } else {
                  setMunicipio(inputValue);
                }
              }
            }}
          />
        </Form.Group>


        <Form.Group controlId="montoTotal">
        <Form.Label>Monto Total</Form.Label>
        <Form.Control
            type="number"
            placeholder="Ingrese el monto total"
            value={editingCliente ? editedMontoTotal : montoTotal}
            onChange={editingCliente ? (e) => setEditedMontoTotal(e.target.value)  : (e) => setMontoTotal(e.target.value)}
        />
        </Form.Group>


        <Form.Group controlId="idFactura">
        <Form.Label>ID de Factura</Form.Label>
        <Form.Control
            type="text"
            placeholder="Ingrese el ID de la factura"
            value={editingCliente ? editedIdFactura : idFactura}
            onChange={editingCliente ? (e) => setEditedIdFactura(e.target.value)  : (e) => setIdFactura(e.target.value)}
        />
        </Form.Group>

        <Form.Group controlId="estado">
        <Form.Label>Estado</Form.Label>
        <Form.Control
          type="text"
          placeholder="Ingrese el estado"
          value={editingCliente ? editedEstado : estado}
          onChange={(e) => {
            const inputValue = e.target.value;
            if (/^[A-Za-z\s]*$/.test(inputValue)) {
              if (editingCliente) {
                setEditedEstado(inputValue);
              } else {
                setEstado(inputValue);
              }
            }
          }}
        />
      </Form.Group>


      <Form.Group controlId="zipCode">
      <Form.Label>ZipCode</Form.Label>
      <Form.Control
        type="text"
        placeholder="Ingrese el código postal"
        value={editingCliente ? editedZipCode : zipCode}
        onChange={(e) => {
          const inputValue = e.target.value;
          if (/^\d*$/.test(inputValue) && inputValue.length <= 5) {
            if (editingCliente) {
              setEditedZipCode(inputValue);
            } else {
              setZipCode(inputValue);
            }
          }
        }}
        maxLength={5} 
      />
      {zipCode.length !== 5 && (
        <Form.Text className="text-danger">
          El código postal debe tener exactamente 5 caracteres.
        </Form.Text>
      )}
    </Form.Group>


        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={editingCliente ? handleSaveEdit : handleAddCliente}
        >
          {editingCliente ? 'Guardar Cambios' : 'Agregar'}
        </Button>
      </Modal.Footer>
    </Modal>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>IdCliente</th>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>RFC</th>
            <th>Estado</th>
            <th>Calle</th>
            <th>Colonia</th>
            <th>IdFactura</th>
            <th>ZipCode</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.idCliente}>
            <td style={{ textAlign: 'center' }}>{cliente.idCliente}</td>
            <td style={{ textAlign: 'center' }}>{cliente.nombre}</td>
            <td style={{ textAlign: 'center' }}>{cliente.apellidos}</td>
            <td style={{ textAlign: 'center' }}>{cliente.rfc}</td>
            <td style={{ textAlign: 'center' }}>{cliente.estado}</td>
            <td style={{ textAlign: 'center' }}>{cliente.calle}</td>
            <td style={{ textAlign: 'center' }}>{cliente.colonia}</td>
            <td style={{ textAlign: 'center' }}>{cliente.idFactura}</td>
            <td style={{ textAlign: 'center' }}>{cliente.zipCode}</td>
            <td style={{ textAlign: 'center' }}>
                <Button variant="info" style={{ marginRight: '10px' }} onClick={() => openDetailsModal(cliente)}>
                  Ver Detalles
                </Button>
                <Button variant="success" style={{ marginRight: '10px' }} onClick={() => handleModify(cliente)}>
                  Modificar
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    handleDelete(cliente.idCliente);
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
          <Modal.Title>No se puede eliminar el cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>{cannotDeleteMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCannotDeleteModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={selectedCliente !== null} onHide={() => setSelectedCliente(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCliente && (
            <div>
              <p>idCliente: {selectedCliente.idCliente}</p>
              <p>nombre: {selectedCliente.nombre}</p>
              <p>apellidos: {selectedCliente.apellidos}</p>
              <p>rfc: {selectedCliente.rfc}</p>
              <p>calle: {selectedCliente.calle}</p>
              <p>numExt: {selectedCliente.numExt}</p>
              <p>numInt: {selectedCliente.numInt}</p>
              <p>colonia: {selectedCliente.colonia}</p>
              <p>municipio: {selectedCliente.municipio}</p>
              <p>estado: {selectedCliente.estado}</p>
              <p>zipcode: {selectedCliente.zipCode}</p>
              <p>fecha: {selectedCliente.fecha}</p>
              <p>montoTotal: {selectedCliente.montoTotal}</p>
              <p>idFactura: {selectedCliente.idFactura}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSelectedCliente(null)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default ClienteList;