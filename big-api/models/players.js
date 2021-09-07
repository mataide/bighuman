const joi = require('@hapi/joi')
const createModel = require('../lib/model-factory')
const dynogels = require('@proak/dynogels')

module.exports = createModel({
    name: 'Players',
    dynamodb: {
        hashKey: 'id',
        timestamps: true,
        schema: joi
            .object({
                id: dynogels.types.uuid(),
                active: joi.boolean().required(),
                last_name: joi
                    .string()
                    .trim()
                    .lowercase()
                    .required(),
                first_name: joi
                    .string()
                    .trim()
                    .lowercase()
                    .required(),
                position: joi
                    .string()
                    .trim()
                    .lowercase()
                    .required(),
                createdAt: joi
                    .date()
                    .default(Date.now, 'time of creation')
                    .required(),
                updatedAt: joi
                    .date()
                    .min(joi.ref('createdAt'))
                    .required()
            })
            .unknown(true)
            .options({ stripUnknown: true })
    }
})
