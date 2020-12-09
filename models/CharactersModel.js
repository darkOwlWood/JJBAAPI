const Joi = require('joi');

const characterId               = Joi.number().integer();
const characterName             = Joi.string().max(30);
const characterNamesake         = Joi.string().max(60);
const characterGenre            = Joi.string();
const characterSpecie           = Joi.string();
const characterAge              = Joi.number().integer();
const characterBirthday         = Joi.string();
const characterImage            = Joi.string();
const characterNacionality      = Joi.array().items(Joi.string());
const characterAbilities        = Joi.array().items(Joi.string());
const characterStands           = Joi.array().items(Joi.object({
                                    name: Joi.string().max(30),
                                    url:  Joi.string(),
                                }));
const characterEpisodesAparence = Joi.array().items(Joi.string());

const getCharacterById = Joi.object({
    id: Joi.string().pattern(new RegExp(/^(\d+|\[\d+(,\d+)*\]|\d+(,\d+)*)$/)),
});

const createCharacter = Joi.object({
    name:              characterName.required(),
    namesake:          characterNamesake.required(),
    genre:             characterGenre.required(),
    specie:            characterSpecie.required(),
    age:               characterAge.required(),
    birthday:          characterBirthday.required(),
    image:             characterImage.required(),
    nacionality:       characterNacionality.required(),
    abilities:         characterAbilities.required(),
    stands:            characterStands.required(),
    episodes_aparence: characterEpisodesAparence.required(),
});

const updateCharacter = Joi.object({
    name:              characterName,
    namesake:          characterNamesake,
    genre:             characterGenre,
    specie:            characterSpecie,
    age:               characterAge,
    birthday:          characterBirthday,
    image:             characterImage,
    nacionality:       characterNacionality,
    abilities:         characterAbilities,
    stands:            characterStands,
    episodes_aparence: characterEpisodesAparence,
});

module.exports = {
    getCharacterById,
    createCharacter,
    updateCharacter,
}