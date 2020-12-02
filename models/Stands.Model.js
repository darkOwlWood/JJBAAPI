const Joi = require('joi');

const standName             = Joi.string().max(30);
const standNamesake         = Joi.string().max(60);
const standUser             = Joi.object({ name: Joi.string().max(30), url: Joi.string()});
const standImage            = Joi.string();
const standAbilities        = Joi.array().items(Joi.string());
const standType             = Joi.array().items(Joi.object({ name: Joi.string().max(30), url: Joi.string() }));
const standAlternativeForms = Joi.array().items(Joi.object({ name: Joi.string().max(30), url: Joi.string() }));
const standStats            = Joi.object({ 
                                    destructive_power:      Joi.string().pattern(new RegExp('^[A-E]$')),
                                    speed:                  Joi.string().pattern(new RegExp('^[A-E]$')),
                                    range:                  Joi.string().pattern(new RegExp('^[A-E]$')),
                                    power_persistence:      Joi.string().pattern(new RegExp('^[A-E]$')),
                                    precision:              Joi.string().pattern(new RegExp('^[A-E]$')),
                                    developmental_potentia: Joi.string().pattern(new RegExp('^[A-E]$'))
                                });
const standEpisodeAparence  = Joi.array().items(Joi.string());
// const standUrl              = Joi.string();
// const standCreated          = Joi.string();


const createStandSchema = {
    name:               standName.required()
    ,namesake:          standNamesake.required()
    ,user:              standUser.required()            
    ,image:             standImage.required()           
    ,abilities:         standAbilities.required()       
    ,type:              standType.required()            
    ,alternative_forms: standAlternativeForms
    ,stats:             standStats.required()           
    ,episode_aparence:  standEpisodeAparence.required()         
}

module.exports = {
    createStandSchema,
}