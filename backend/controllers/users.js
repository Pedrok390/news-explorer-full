const User = require('../models/users');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUsers = (req, res, next) => {
    User.find({})
        .orFail(() => {
            const error = new Error("Nenhum usuário encontrado");
            error.statusCode = 404;
            throw error;
        })
        .then((users) => res.send(users))
        .catch((e) => {
            const err = new Error("Erro interno do servidor");
            err.statusCode = 500;
            return next(err);
        });
};
module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .orFail()
    .then((user) => {
      if (!user) {
        const err = new Error("Usuário não encontrado");
        err.statusCode = 404;
        return next(err);
      }
      res.send(user);
    })
    .catch(e => {
      if (e.name === 'ValidationError') {
        const err = new Error("Dados inválidos");
        err.statusCode = 400;
        return next(err);
      }
      if (e.name === 'DocumentNotFoundError') {
        const err = new Error("Usuário não encontrado");
        err.statusCode = 404;
        return next(err);
      }
      const err = new Error("Erro interno do servidor");
      err.statusCode = 500;
      return next(err);
    });
};
module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({ email, password: hash, name }))
    .then((user) => res.status(201).send({ _id: user._id, email: user.email, name: user.name }))
    .catch((e) => {
      console.log(e);
      if (e.name === 'ValidationError') {
        const err = new Error("Dados inválidos");
        err.statusCode = 400;
        return next(err);
      }
      const err = new Error("Erro interno do servidor");
      err.statusCode = 500;
      return next(err);
    });
};
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
        { expiresIn: "7d" }
      );
      res.send({ token });
    })
    .catch((e) => {
      const err = new Error("Credenciais inválidas");
      err.statusCode = 401;
      return next(err);
    });
}

module.exports.getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((e) => {
      if (e.name === 'DocumentNotFoundError') {
        const err = new Error("Usuário não encontrado");
        err.statusCode = 404;
        return next(err);
      }
      const err = new Error("Erro interno do servidor");
      err.statusCode = 500;
      return next(err);
    });
}