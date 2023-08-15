const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet'); // защита от некоторых широко известных веб-уязвимостей
const router = require('./routes/index');

const { PORT = 3000 } = process.env;
const app = express();

app.use(helmet()); // защита
mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb', {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  });

app.use(express.json()); // вместо body-parser
app.use((req, res, next) => {
  req.user = {
    _id: '64d8a07dd9233992b8a48e42',
  };
  next();
});
app.use(router);

app.listen(PORT, () => {
  console.log(`App started at port: ${PORT}`);
});
