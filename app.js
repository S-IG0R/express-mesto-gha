const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet'); // защита от некоторых широко известных веб-уязвимостей
const { errors } = require('celebrate');
const limit = require('./middlewares/rateLimit'); // ограничитель запросов к серверу
// const { celebrate, Joi } = require('celebrate');
// const { createNewUser, login } = require('./controllers/users');
// const auth = require('./middlewares/auth');
const router = require('./routes/index');
const errorHandler = require('./middlewares/error-handler');

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

app.use(express.json()); // парсер тела запросов вместо body-parser
app.use(limit);
// app.post(
//   '/signin',
//   celebrate({
//     body: Joi.object().keys({
//       email: Joi.string().required().email(),
//       password: Joi.string().required(),
//     }),
//   }),
//   login,
// );

// app.post(
//   '/signup',
//   celebrate({
//     body: Joi.object().keys({
//       email: Joi.string().required().email(),
//       password: Joi.string().required().min(8),
//       about: Joi.string().min(2).max(30),
//       avatar: Joi.string()
//         .regex(/https?:\/\/.{1,}/),
//       name: Joi.string().min(2).max(30),
//     }),
//   }),
//   createNewUser,
// );

app.use(router);
// app.use(auth);

// обработчик ошибок celebrate
app.use(errors());

// мидлвэр для центр. обработки ошибок
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App started at port: ${PORT}`);
});
