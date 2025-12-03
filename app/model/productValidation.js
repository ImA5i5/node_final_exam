
const Joi = require("joi");
const mongoose = require("mongoose");


const objectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

const base = {
  name: Joi.string().trim().min(3).max(100).required()
    .messages({
      "string.empty": "Product name is required",
      "string.min": "Product name must be at least 3 characters",
      "string.max": "Product name must be at most 100 characters",
    }),
  category: Joi.string().custom(objectId, "ObjectId validation").required()
    .messages({
      "any.invalid": "Invalid category selected",
      "string.empty": "Category is required",
    }),
  description: Joi.string().trim().min(10).max(2000).required()
    .messages({
      "string.empty": "Description is required",
      "string.min": "Description must be at least 10 characters",
      "string.max": "Description must be less than 2000 characters",
    }),
};

const createProductSchema = Joi.object(base);     
const updateProductSchema = Joi.object(base);       

module.exports = { createProductSchema, updateProductSchema };