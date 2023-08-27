const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getAllUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/users'); // импорт контроллеров запросов

// получаем список всех пользователей
router.get(
  '/users',
  celebrate({
    headers: Joi.object()
      .keys({ authorization: Joi.string().required() })
      .unknown(),
  }),
  getAllUsers,
);

// получаем данные тек. пользователя
router.get(
  '/users/me',
  celebrate({
    headers: Joi.object()
      .keys({ authorization: Joi.string().required() })
      .unknown(),
  }),
  getCurrentUser,
);

// получаем данные пользователя по ID
router.get(
  '/users/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().alphanum().length(24),
    }),
    headers: Joi.object()
      .keys({ authorization: Joi.string().required() })
      .unknown(),
  }),
  getUserById,
);

// обновляем данные профиля
router.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string(),
      about: Joi.string(),
    }),
    headers: Joi.object()
      .keys({ authorization: Joi.string().required() })
      .unknown(),
  }),
  updateProfile,
);

// обновляем аватар
router.patch(
  '/users/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string()
        .regex(/https?:\/\/.{1,}/)
        .required(),
    }),
    headers: Joi.object()
      .keys({ authorization: Joi.string().required() })
      .unknown(),
  }),
  updateAvatar,
);

module.exports = router;
