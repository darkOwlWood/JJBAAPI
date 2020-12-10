const express = require('express');
const router = express.Router();
const { validateSchema } = require('../utils/middleware/validationSchemaHandler');
const { getEpisodeById, createEpisode, updateEpisode } = require('../models/EpisodesModel');
const EpisodesController = require('../controllers/EpisodesController');
const episodesController = new EpisodesController();

const EpisodesRoute = (app) => {
    app.use('/episodes',router);

    router.get('/',episodesController.getAllEpisodes);
    router.get('/:id',validateSchema(getEpisodeById,'params'),episodesController.getEpisodeById);
    router.post('/',validateSchema(createEpisode),episodesController.insertEpisode);
    router.put('/:id',validateSchema(getEpisodeById,'params'),validateSchema(updateEpisode),episodesController.updateEpisode);
    router.delete('/:id',validateSchema(getEpisodeById,'params'),episodesController.deleteEpisode);
};

module.exports = { EpisodesRoute };