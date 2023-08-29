const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const limit = require('./middlewares/rateLimit');
const router = require('./routes/index');
const errorHandler = require('./middlewares/error-handler');

const { PORT = 3000 } = process.env;
const app = express();

mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb', {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  });

// ограничитель запросов к серверу
app.use(limit);

// защита от некоторых широко известных веб-уязвимостей
app.use(helmet());

// парсер тела запросов вместо body-parser
app.use(express.json());

// все руты приложения
app.use(router);

// обработчик ошибок celebrate
app.use(errors());

// центр. обработки ошибок
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App started at port: ${PORT}`);
});
