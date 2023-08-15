const {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = require('http2').constants;

const { default: mongoose } = require('mongoose');
const User = require('../models/user');

// получаем всех пользователей
const getAllUsers = (req, res) => {
  return User.find({})
    .then((users) => {
      return res.status(HTTP_STATUS_OK).send(users);
    })
    .catch(() => {
      return res
        .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: 'Ошибка на сервере' });
    });
};

// получаем конкретного пользователя по id
const getUserById = (req, res) => {
  return User.findById(req.params.userId)
    .orFail(new Error('InvalidUserId')) // когда приходит пусто user, создаем ошибку и переходим в блок catch, там ее отлавливаем
    .then((user) => {
      return res.status(HTTP_STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err.message === 'InvalidUserId') {
        return res
          .status(HTTP_STATUS_NOT_FOUND)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      }
      if (
        err instanceof mongoose.Error.ValidationError
        || err instanceof mongoose.Error.CastError
      ) {
        return res
          .status(HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные' });
      }
      return res
        .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: 'Ошибка на сервере' });
    });
};

// создаем нового пользователя
const createNewUser = (req, res) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then((newUser) => {
      return res.status(HTTP_STATUS_CREATED).send(newUser);
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

// обновляем профиль пользователя
const updateProfile = (req, res) => {
  const { name, about } = req.body;
  return User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(new Error('InvalidUserId'))
    .then((user) => {
      res.status(HTTP_STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err.message === 'InvalidUserId') {
        return res
          .status(HTTP_STATUS_NOT_FOUND)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      }
      if (
        err instanceof mongoose.Error.CastError
        || err instanceof mongoose.Error.ValidationError
      ) {
        return res
          .status(HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные' });
      }
      return res
        .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: 'Ошибка на сервере' });
    });
};

// обновляем аватар пользователя
const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail(new Error('InvalidUserId'))
    .then((user) => {
      return res.status(HTTP_STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err.message === 'InvalidUserId') {
        return res
          .status(HTTP_STATUS_NOT_FOUND)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      }
      if (
        err instanceof mongoose.Error.CastError
        || err instanceof mongoose.Error.ValidationError
      ) {
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
  getAllUsers,
  getUserById,
  createNewUser,
  updateProfile,
  updateAvatar,
};
