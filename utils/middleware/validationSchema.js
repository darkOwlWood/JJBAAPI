const e = require('express');
const Joi = require('Joi');

const validate = (data, schema) => {
    const { error } = Joi.validateSchema(data,schema);
    return error;
}

const validateSchema = (schema, check = 'body') => {
    return (req, res, next) => {
        const error = validate(req[check],schema);
        error? next(error) : next();
    }
}

module.exports = { validateSchema }