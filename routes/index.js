const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const userRouter = require('./users');
const cardRouter = require('./cards');
const NotFoundError = require('../errors/NotFoundError');
const { createNewUser, login } = require('../controllers/users');

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string()
        .regex(/https?:\/\/.{1,}/),
      name: Joi.string().min(2).max(30),
    }),
  }),
  createNewUser,
);

router.use(userRouter);
router.use(cardRouter);
router.use('*', (req, res, next) => {
  next(new NotFoundError('Обращение к несуществующему пути'));
});

module.exports = router;
