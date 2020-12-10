const Joi = require('joi');

const episodeId          = Joi.number().integer();
const episodeName        = Joi.string().max(30);
const episodeCode        = Joi.string().max(10);
const episodeAirDate     = Joi.string();
const episodeAnime       = Joi.object({
                            name:              Joi.string().max(30),
                            part:              Joi.string().max(30),
                            code:              Joi.string().max(10),
                            studio:            Joi.string().max(20),                    
                            genre:             Joi.array().items(Joi.string()),
                            description:       Joi.string(),
                            first_aired:       Joi.string(),
                            last_aired:        Joi.string(),
                            episodes_released: Joi.number().integer(),
                        });
const episodesCharacters = Joi.array().items(Joi.string());

const getEpisodeById = Joi.object({
    id: Joi.string().pattern(new RegExp(/^(\d+|\[\d+(,\d+)*\]|\d+(,\d+)*)$/))
});

const createEpisode = Joi.object({
    name:       episodeName.required(),
    code:       episodeCode.required(),
    air_date:   episodeAirDate.required(),
    anime:      episodeAnime.required(),
    characters: episodesCharacters.required(),
});

const updateEpisode = Joi.object({
    name:       episodeName,
    code:       episodeCode,
    air_date:   episodeAirDate,
    anime:      episodeAnime,
    characters: episodesCharacters,
});

module.exports = {
    getEpisodeById,
    createEpisode,
    updateEpisode
}