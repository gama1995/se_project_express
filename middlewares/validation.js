const { celebrate, Joi } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }

  return helpers.error("string.uri");
};

const validateSignup = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    avatar: Joi.string().custom(validateURL).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const validateSignin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const validateClothingItem = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    weather: Joi.string().valid("hot", "warm", "cold").required(),
    imageUrl: Joi.string().custom(validateURL).required(),
  }),
});

const validateItemId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().hex().length(24).required(),
  }),
});

const validateUserProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    avatar: Joi.string().custom(validateURL).required(),
  }),
});

module.exports = {
  validateSignup,
  validateSignin,
  validateClothingItem,
  validateItemId,
  validateUserProfile,
};