const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: [2, 'Минимальная длина поля "name" - 2 символа'],
      maxlength: [30, 'Максимальная длина поля "name" - 30 символов'],
    },
    about: {
      type: String,
      required: true,
      minlength: [2, 'Минимальная длина поля "name" - 2 символа'],
      maxlength: [30, 'Максимальная длина поля "name" - 30 символов'],
    },
    avatar: {
      type: String,
      required: true,
      validate: {
        validator: (v) => {
          // валидация ссылки
          validator.isURL(v);
        },
        message: 'Некорректный URL',
      },
    },
  },
  { versionKey: false }, // отключает __v
);

module.exports = mongoose.model('user', userSchema);
