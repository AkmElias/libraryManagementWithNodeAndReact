const Joi = require('joi')

const registerValidation = data => {
    const schema = Joi.object( {
        Name: Joi.string().min(4).required(),
        Email: Joi.string().min(6).required().email(),
        Password: Joi.string().min(6).required()
    })

    return schema.validate(data)
}

const loginValidation = data => {
    const schema = Joi.object( {
        Email: Joi.string().min(6).required().email(),
        Password: Joi.string().min(6).required()
    })

    return schema.validate(data)
}

const bookValidation = data => {
    const schema = Joi.object({
        name: Joi.string().min(4).required(),
        author: Joi.string().min(4).required(),
        category: Joi.date().required(),
    })

    return schema.validate(data)
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.bookValidation = bookValidation;