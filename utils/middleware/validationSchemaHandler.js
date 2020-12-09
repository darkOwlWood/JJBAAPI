const Joi = require('Joi');
const Boom = require('@hapi/boom');

const validate = (data, schema) => {
    const { error } = schema.validate(data);
    return error;
}

const validateSchema = (schema, check = 'body') => {
    return (req, res, next) => {
        const error = validate(req[check],schema);
        error? next(Boom.badRequest(error)) : next();
    }
}

module.exports = { validateSchema }