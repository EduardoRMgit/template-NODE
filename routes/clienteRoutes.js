const express = require('express');
const cors = require('cors');
const { Cliente } = require('../models');
const router = express.Router();
router.use(cors());



//================== API CLIENTE =========================

//GET
router.get('/api/v1/clientes', async (req, res) => {
try {
    const clientes = await Cliente.findAll();
    res.json(clientes);
} catch (error) {
    res.status(500).json({ error: 'Error al obtener los clientes :C.' });
}
});

router.get('/api/v1/clientes/:idCliente', async (req, res) => {
try{
    const idCliente = req.params.idCliente;
    const cliente = await Cliente.findOne({ where: { idCliente } });
    if (cliente){
    res.json(cliente);
    } else{
    res.status(404).json({ error: 'Cliente no encontrado :C.' });
    } 
} catch (error) {
    res.status(500).json({ error: 'Error al obtener  cliente :C.' });
}
});

//POST

router.post('/api/v1/clientes/', async (req, res) => {
const idCliente = req.body.idCliente;
const nombre = req.body.nombre;
const apellidos = req.body.apellidos;
const rfc = req.body.rfc;
const calle = req.body.calle;
const numExt = req.body.numExt;
const numInt = req.body.numInt;
const colonia = req.body.colonia;
const municipio = req.body.municipio;
const estado = req.body.estado;
const zipCode = req.body.zipCode;
const montoTotal = req.body.montoTotal;
const idFactura = req.body.idFactura;

try {
    const cliente = await Cliente.create({idCliente, nombre, apellidos, rfc,
                                        calle, numExt, numInt, colonia, 
                                        municipio, estado, zipCode, montoTotal, 
                                        idFactura});
    res.status(201).json(cliente);
} catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al crear cliente :C.' });
}
});

//Delete
router.delete('/api/v1/clientes/:idCliente', async (req, res) => {
const idCliente = req.params.idCliente;
try {
    const deletedCliente = await Cliente.destroy({ where: { idCliente } });
    if (deletedCliente === 1){ 
        res.status(200).json({ message: 'Cliente eliminado correctamente.' });
    } else if (deletedCliente === 0){
        res.status(200).json({ message: 'Cliente no encontrado :C.' });
    }
} catch (error) {
    res.status(500).json({ error: 'Error al borrar al Cliente :C.' });
}
});

// UPDATE
router.put('/api/v1/clientes/:idCliente', async (req, res) => {
    const idCliente = req.params.idCliente;

    try {
        const updatedCliente = req.body;
    
        const [rowsAffected] = await Cliente.update(updatedCliente, {
          where: { idCliente }
        });
    
        if (rowsAffected > 0) {
          res.status(200).json({ message: 'Cliente actualizado correctamente.' });
        } else {
          res.status(404).json({ message: 'Cliente no encontrado :C.' });
        }
      } catch (error) {
        res.status(500).json({ error: 'Error al actualizar al Cliente :C.' });
      }
    });


module.exports = router;
