const express = require("express");
const router = express.Router();
const { celebrate, Joi } = require("celebrate");
const { getUsers, getUserById, getCurrentUser } = require('../controllers/users')

router.get('/', getUsers);
router.get('/me', getCurrentUser)
router.get('/:id', celebrate({
    params: Joi.object({
        id: Joi.string().hex().length(24).required()
    })
}) ,getUserById)

module.exports = router;