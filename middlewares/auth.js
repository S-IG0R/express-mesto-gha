const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Необходима авторизация');
  }
  const token = authorization.replace('Bearer ', ''); // Убираем приставку Bearer
  let payload;
  try {
    // если удалось верифицировать ключ, записывается _id в пейлоуд
    payload = jwt.verify(token, 'secret_key');
  } catch (err) {
    throw new UnauthorizedError('Необходима авторизация');
  }
  // добавляем _id ко всем запросам
  req.user = payload;
  next();
};
