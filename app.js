const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet'); // защита от некоторых широко известных веб-уязвимостей
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const { createNewUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const router = require('./routes/index');

const { PORT = 3000 } = process.env;
const app = express();

app.use(helmet()); // устанавл. заголовки безопасности
mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb', {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  });

app.use(express.json()); // бодипарсер вместо body-parser

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      about: Joi.string().max(30),
      avatar: Joi.string()
        .regex(/https?:\/\/.{1,}/),
      name: Joi.string(),
    }),
  }),
  createNewUser,
);

app.use(auth);
app.use(router);

app.use(errors());

// мидлвэр для центр. обработки ошибок
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
  next();
});

app.listen(PORT, () => {
  console.log(`App started at port: ${PORT}`);
});
