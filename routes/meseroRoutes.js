const express = require('express');
const cors = require('cors');
const { Mesero } = require('../models');
const router = express.Router();
router.use(cors());



//================== API MESERO =========================

//GETs
router.get('/api/v1/meseros/', async (req, res) => {
    try {
      const meseros = await Mesero.findAll();
      res.json(meseros);
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Error al obtener los meseros :C.' });
    }
  });

router.get('/api/v1/meseros/:idMesero', async (req, res) => {
try{
    const idMesero = req.params.idMesero;
    const mesero = await Mesero.findOne({ where: { idMesero } });

    if (mesero){
        res.json(mesero);
    } else{
    res.status(404).json({ error: 'Mesero no encontrado :C.' });
    } 
} catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error al obtener  mesero :C.' });
}
});

//POST

router.post('/api/v1/meseros/', async (req, res) => {
const idMesero  = req.body.idMesero;
const nombre = req.body.nombre;
const apellidos = req.body.apellidos;

try {
    const mesero = await Mesero.create({ idMesero, nombre, apellidos});
    res.status(201).json(mesero);
} catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error al crear mesero :C.' });
}
});

//Delete

router.delete('/api/v1/meseros/:idMesero', async (req, res) => {
const idMesero = req.params.idMesero;
try {
    const deletedMesero = await Mesero.destroy({ where: { idMesero } });
    if (deletedMesero === 1){
        res.status(200).json({ message: 'Mesero eliminado correctamente.' });
    } else if (deletedMesero === 0){
        res.status(200).json({ message: 'Mesero no encontrado :C.' });
    }
} catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error al borrar el Mesero :C.' });
}
});

// PUT
router.put('/api/v1/meseros/:idMesero', async (req, res) => {
    const idMesero = req.params.idMesero;
  
    try {
      const updatedMesero = req.body; // Assuming the entire mesero object is sent for update
  
      const [rowsAffected] = await Mesero.update(updatedMesero, {
        where: { idMesero }
      });
  
      if (rowsAffected > 0) {
        res.status(200).json({ message: 'Mesero actualizado correctamente.' });
      } else {
        res.status(404).json({ message: 'Mesero no encontrado :C.' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el mesero :C.' });
    }
  });

module.exports = router;
