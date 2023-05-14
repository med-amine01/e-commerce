const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const orderValidSchema = Joi.object({
  date: Joi.date().default(Date.now),
  status: Joi.string().valid('created', 'canceled').default('created'),
  client: Joi.objectId().required(),
  total: Joi.number().optional(),
  items: Joi.array().items(
    Joi.object({
      item: Joi.objectId().required(),
      quantity: Joi.number().required(),
    })
  ).required(),
});

function validateOrder(order) {
  return orderValidSchema.validate(order);
}

module.exports = {
  validateOrder,
};
