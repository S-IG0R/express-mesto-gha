const {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = require('http2').constants;

const { default: mongoose } = require('mongoose');
const Card = require('../models/card');

// получение всех карточек
const getAllCards = (req, res) => {
  return Card.find({})
    .then((cards) => {
      return res.status(HTTP_STATUS_OK).send(cards);
    })
    .catch(() => {
      return res
        .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: 'Ошибка на сервере' });
    });
};

// создание карточки
const createCard = (req, res) => {
  const { name, link } = req.body;
  return Card.create({ name, link, owner: req.user._id })
    .then((newCard) => {
      return res.status(HTTP_STATUS_CREATED).send(newCard);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res
          .status(HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные' });
      }
      return res
        .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: 'Ошибка на сервере' });
    });
};

// удаление карточки
const deleteCard = (req, res) => {
  return Card.findByIdAndDelete(req.params.cardId)
    .orFail(new Error('InvalidCardId'))
    .then(() => {
      return res.status(HTTP_STATUS_OK).send({ message: 'Карточка удалена' });
    })
    .catch((err) => {
      if (err.message === 'InvalidCardId') {
        return res
          .status(HTTP_STATUS_NOT_FOUND)
          .send({ message: 'Запрашиваемая карточка не найдена' });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res
          .status(HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные' });
      }
      return res
        .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: 'Ошибка на сервере' });
    });
};

// ставим лайк карточке
const putLike = (req, res) => {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(new Error('InvalidCardId'))
    .then((response) => {
      return res.status(HTTP_STATUS_OK).send(response);
    })
    .catch((err) => {
      if (err.message === 'InvalidCardId') {
        return res
          .status(HTTP_STATUS_NOT_FOUND)
          .send({ message: 'Запрашиваемый карточка не найдена' });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res
          .status(HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные' });
      }
      return res
        .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: 'Ошибка на сервере' });
    });
};

// удаляем лайк с карточки
const deleteLike = (req, res) => {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(new Error('InvalidCardId'))
    .then((response) => {
      return res.status(HTTP_STATUS_OK).send(response);
    })
    .catch((err) => {
      if (err.message === null) {
        return res
          .status(HTTP_STATUS_NOT_FOUND)
          .send({ message: 'Запрашиваемый карточка не найдена' });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res
          .status(HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные' });
      }
      return res
        .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: 'Ошибка на сервере' });
    });
};

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
};
