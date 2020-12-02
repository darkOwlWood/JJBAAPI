const express = require('express');
const router = express.Router();
const StandController = require('../controllers/StandsController');
const standController = new StandController();

const  standRouter = (app) => {
    app.use('/stands',router);

    router.post('/',standController.insertStand);
}

module.exports = { standRouter }