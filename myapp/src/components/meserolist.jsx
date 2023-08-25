  import React, { useState, useEffect } from 'react';
  import { Modal, Form, Button, Table } from 'react-bootstrap';
  import { default as axios } from 'axios';

  const MeseroList = () => {
  const [meseros, setMeseros] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [showCannotDeleteModal, setShowCannotDeleteModal] = useState(false);
  const [cannotDeleteMessage, setCannotDeleteMessage] = useState('');
  const [selectedMesero, setSelectedMesero] = useState(null);

  const [editingMesero, setEditingMesero] = useState(null); 
  const [editedNombre, setEditedNombre] = useState(''); 
  const [editedApellidos, setEditedApellidos] = useState('');
  

    const fetchMeseros = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/v1/meseros'); // Reemplaza 'URL_DEL_API' por la URL de tu API
        setMeseros(response.data);
      } catch (error) {
        console.error('Error al obtener los Meseros:', error);
      }
    };

    useEffect(() => {
      // Al cargar el componente, inicia el temporizador para obtener los proveedores cada 5 segundos
      const timer = setInterval(fetchMeseros, 500);

      // Al desmontar el componente, limpia el temporizador
      return () => {
        clearInterval(timer);
      };
      }, []);

      const handleAddMesero = async () => {
        try {
          const response = await axios.post('http://localhost:4000/api/v1/meseros/', {
            nombre,
            apellidos,
          });
          if (response.status === 201) {
            fetchMeseros(); // Refresh the meseros list after adding a new one
            handleCloseModal(); // Close the modal after successful addition
          }
        } catch (error) {
          console.error('Error al agregar el Mesero:', error);
        }
      };

      const handleDelete = async (idMesero) => {
        try {
          const response = await axios.delete(`http://localhost:4000/api/v1/meseros/${idMesero}`);
          if (response.status === 200) {
            fetchMeseros();
          }
        } catch (error) {
          if (error.response && error.response.status === 500) {
            setShowCannotDeleteModal(true);
            setCannotDeleteMessage('No se puede eliminar el mesero debido a restricciones de clave externa.');
          }
        }
      };
    

      const handleCloseModal = () => {
        setShowModal(false);
        setNombre('');
        setApellidos('');
        setEditingMesero(null);
        setEditedNombre('');
        setEditedApellidos('');
      };


      const openDetailsModal = (mesero) => {
        setSelectedMesero(mesero);
      };

      const handleModify = (mesero) => {
        setEditingMesero(mesero);
        setEditedNombre(mesero.nombre);
        setEditedApellidos(mesero.apellidos);
        setShowModal(true);
      };
    
      const handleSaveEdit = async () => {
        try {
          const response = await axios.put(`http://localhost:4000/api/v1/meseros/${editingMesero.idMesero}`, {
            nombre: editedNombre,
            apellidos: editedApellidos,
          });
      
          if (response.status === 200) {
            fetchMeseros();
            handleCloseModal();
          }
        } catch (error) {
          console.error('Error al modificar el Mesero:', error);
        }
      };



    return (
      <div>
        <br></br>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <h1 style={{ fontSize: '24px', marginBottom: '0' }}>Meseros</h1>
          <Button variant="primary" style={{ marginLeft: '20px' }} onClick={() => setShowModal(true)}>
            Agregar Mesero
          </Button>
        </div>
        <br></br>
        <Modal show={showModal} onHide={handleCloseModal}>
  <Modal.Header closeButton>
    <Modal.Title>
      Mesero
    </Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Form.Group controlId="nombre">
        <Form.Label>Nombre</Form.Label>
        <Form.Control
          type="text"
          placeholder="Ingrese el nombre del mesero"
          value={editingMesero ? editedNombre : nombre}
          onChange={(e) => {
            if (editingMesero) {
              setEditedNombre(e.target.value.replace(/[^A-Za-z ]/g, ''));
            } else {
              setNombre(e.target.value.replace(/[^A-Za-z ]/g, ''));
            }
          }}
        />
      </Form.Group>
      <Form.Group controlId="apellidos">
        <Form.Label>Apellidos</Form.Label>
        <Form.Control
          type="text"
          placeholder="Ingrese los apellidos del mesero"
          value={editingMesero ? editedApellidos : apellidos}
          onChange={(e) => {
            if (editingMesero) {
              setEditedApellidos(e.target.value.replace(/[^A-Za-z ]/g, ''));
            } else {
              setApellidos(e.target.value.replace(/[^A-Za-z ]/g, ''));
            }
          }}
        />
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleCloseModal}>
      Cancelar
    </Button>
    <Button variant="primary" onClick={editingMesero ? handleSaveEdit : handleAddMesero}>
      {editingMesero ? 'Guardar Cambios' : 'Agregar'}
    </Button>
  </Modal.Footer>
</Modal>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>IdMesero</th>
              <th>Nombre</th>
              <th>Apellidos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {meseros.map((mesero) => (
              <tr key={mesero.idMesero}>
              <td style={{ textAlign: 'center' }}>{mesero.idMesero}</td>
              <td style={{ textAlign: 'center' }}>{mesero.nombre}</td>
              <td style={{ textAlign: 'center' }}>{mesero.apellidos}</td>
              <td style={{ textAlign: 'center' }}>
                  <Button variant="info" style={{ marginRight: '10px' }} onClick={() => openDetailsModal(mesero)}>
                    Ver Detalles
                  </Button>
                  <Button variant="success" style={{ marginRight: '10px' }} onClick={() => handleModify(mesero)}>
                  Modificar
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      handleDelete(mesero.idMesero);
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
            <Modal.Title>No se puede eliminar el mesero</Modal.Title>
          </Modal.Header>
          <Modal.Body>{cannotDeleteMessage}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCannotDeleteModal(false)}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={selectedMesero !== null} onHide={() => setSelectedMesero(null)}>
          <Modal.Header closeButton>
            <Modal.Title>Detalles del Mesero</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedMesero && (
              <div>
                <p>IdMesero: {selectedMesero.idMesero}</p>
                <p>Nombre: {selectedMesero.nombre}</p>
                <p>Apellidos: {selectedMesero.apellidos}</p>
                {/* Add more mesero details as needed */}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setSelectedMesero(null)}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>

      </div>
    );
  };

  export default MeseroList;