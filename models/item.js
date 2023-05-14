const mongoose = require('mongoose');
const Joi = require('joi');
const uniqueValidator = require('mongoose-unique-validator');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: Buffer,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  quantity: {
    type: Number,
    default: 0,
  },
});

itemSchema.plugin(uniqueValidator);

const Item = mongoose.model('Item', itemSchema);

// Joi validation schema for item
const itemValidSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  description: Joi.string().required(),
  image: Joi.binary(),
  owner: Joi.objectId(),
  quantity: Joi.number().default(0),
});

function validateItem(item) {
  return itemValidSchema.validate(item);
}

module.exports = {
  Item,
  validateItem,
};
