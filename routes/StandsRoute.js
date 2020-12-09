const express = require('express');
const router = express.Router();
const { validateSchema } = require('../utils/middleware/validationSchemaHandler');
const { getStandById, createStandSchema, updateStandSchema } = require('../models/StandsModel.js');
const StandController = require('../controllers/StandsController');
const standController = new StandController();

const  standRouter = (app) => {
    app.use('/stands',router);

    router.get('/',standController.getAllStands);
    router.get('/:id',validateSchema(getStandById,'params'),standController.getStandById);
    router.post('/',validateSchema(createStandSchema),standController.insertStand);
    router.put('/:id',validateSchema(getStandById,'params'),validateSchema(updateStandSchema),standController.updateStand);
    router.delete('/:id',validateSchema(getStandById,'params'),standController.deleteStand);
}

module.exports = { standRouter }