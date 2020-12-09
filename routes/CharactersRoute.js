const express = require('express');
const router = express.Router();
const { validateSchema } = require('../utils/middleware/validationSchemaHandler');
const { getCharacterById, createCharacter, updateCharacter } = require('../models/CharactersModel');
const CharactersController = require('../controllers/CharactersController');
const charactersController = new CharactersController();

const charactersRoute = (app) => {
    app.use('/characters',router);

    router.get('/',charactersController.getAllCharacters);
    router.get('/:id',validateSchema(getCharacterById,'params'),charactersController.getCharactersById);
    router.post('/',validateSchema(createCharacter),charactersController.insertCharacter);
    router.put('/:id',validateSchema(getCharacterById,'params'),validateSchema(updateCharacter),charactersController.updateCharacter);
    router.delete('/:id',validateSchema(getCharacterById,'params'),charactersController.deleteCharacter);
}

module.exports = { charactersRoute };
