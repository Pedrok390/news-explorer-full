const Card = require('../models/cards')

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then(cards => res.send(cards))
    .catch(() => {
      const err = new Error("Erro interno do servidor");
      err.statusCode = 500;
      return next(err);
    });
};

module.exports.getMyCards = (req, res, next) => {
    Card.find({ owner: req.user._id })
    .then(cards => res.send(cards))
    .catch(() => {
        const err = new Error("Erro interno do servidor");
        err.statusCode = 500;
        return next(err);
    });
}
module.exports.addCard = (req, res, next) => {
    const {
    keyword,
    author,
    content,
    description,
    publishedAt,
    source,
    title,
    url,
    urlToImage,
  } = req.body;

  Card.create({
    keyword,
    author,
    content,
    description,
    publishedAt,
    source,
    title,
    url,
    urlToImage,
    owner: req.user._id,
  })
  .then((cards) =>{
    res.status(201).send(cards)
  })
  .catch((e) => {
    if (e.name === 'ValidationError') {
        const err = new Error('Dados inválidos');
        err.statusCode = 400;
        return next(err);
    }
    const err = new Error('Erro interno do servidor');
    err.statusCode = 500;
    return next(err);
    });
}

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        const err = new Error("Cartão não encontrado");
        err.statusCode = 404;
        throw err;
      }

      if (!card.owner.equals(req.user._id)) {
        const err = new Error(
          "Você não tem permissão para excluir este cartão"
        );
        err.statusCode = 403;
        throw err;
      }

      return Card.findByIdAndDelete(req.params.cardId);
    })
    .then((deletedCard) => {
      res.status(200).send(deletedCard);
    })
    .catch((e) => {
      if (e.name === "CastError") {
        const err = new Error("ID inválido");
        err.statusCode = 400;
        return next(err);
      }

      next(e);
    });
};