const express = require('express');
const cors = require('cors');
const { Factura } = require('../models');
const router = express.Router();
router.use(cors());





//================== API FACTURA =========================

//GET
router.get('/api/v1/facturas', async (req, res) => {
try {
    const facturas = await Factura.findAll();
    res.json(facturas);
} catch (error) {
    res.status(500).json({ error: 'Error al obtener las facturas :C.' });
}
});

router.get('/api/v1/facturas/:idFactura', async (req, res) => {
try{
    const idFactura = req.params.idFactura;
    const factura = await Factura.findOne({ where: { idFactura } });
    if (factura){
    res.json(factura);
    } else{
    res.status(404).json({ error: 'Factura no encontrada :C.' });
    } 
} catch (error) {
    res.status(500).json({ error: 'Error al obtener  factura :C.' });
}
});

//POST

router.post('/api/v1/facturas/', async (req, res) => {
const idFactura = req.body.idFactura;
const idMesero = req.body.idMesero;
const mesa = req.body.mesa;
const subTotal = req.body.subTotal;
const total = req.body.total;
try {
    const factura = await Factura.create({idFactura, idMesero, mesa, subTotal, total});
    res.status(201).json(factura);
} catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error al crear factura :C.' });
}
});

//Delete

router.delete('/api/v1/facturas/:idFactura', async (req, res) => {
const idFactura = req.params.idFactura;
try {
    const deletedFactura = await Factura.destroy({ where: { idFactura } });
    if (deletedFactura === 1){ 
        res.status(200).json({ message: 'Factura eliminada correctamente.' });
    } else if (deletedFactura === 0){
        res.status(200).json({ message: 'Factura no encontrada :C.' });
    }
} catch (error) {
    res.status(500).json({ error: 'Error al borrar la factura :C.' });
}
});

// PUT
router.put('/api/v1/facturas/:idFactura', async (req, res) => {
    const idFactura = req.params.idFactura;
  
    try {
      const updatedFactura = req.body;
  
      const [rowsAffected] = await Factura.update(updatedFactura, {
        where: { idFactura }
      });
  
      if (rowsAffected > 0) {
        res.status(200).json({ message: 'Factura actualizada correctamente.' });
      } else {
        res.status(404).json({ message: 'Factura no encontrada :C.' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar la factura :C.' });
    }
  });



module.exports = router;
