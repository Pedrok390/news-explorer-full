const express = require('express')
const router = express.Router()
const { celebrate, Joi } = require("celebrate");
const validator = require('validator')
const { getCards, getMyCards, addCard, deleteCard } = require('../controllers/cards')
const validateURL = (value, helpers) => {
  if (value === null) {
    return value;
  }

  if (validator.isURL(value)) {
    return value;
  }

  return helpers.error('string.uri');
};

router.get('/', getCards)
router.get('/me', getMyCards)
router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      keyword: Joi.string().required(),
      author: Joi.string().allow(null),
      content: Joi.string().allow(null),
      description: Joi.string().allow(null),
      publishedAt: Joi.date().required(),
      source: Joi.object({
        id: Joi.string().allow(null),
        name: Joi.string().required(),
      }).required(),
      title: Joi.string().required(),
      url: Joi.string().required().custom(validateURL),
      urlToImage: Joi.string().allow(null).custom(validateURL),
    }),
  }),
  addCard
);
router.delete("/:cardId",celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24).required(),
    }),
  }),
  deleteCard
);

module.exports = router;