const router = require('express').Router();

const {
  getAllUsers,
  getUserById,
  createNewUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users'); // импорт контроллеров запросов

// получаем список всех пользователей
router.get('/users', getAllUsers);

// получаем данные пользователя по ID
router.get('/users/:userId', getUserById);

// создаем нового пользователя
router.post('/users', createNewUser);

// обновляем данные профиля
router.patch('/users/me', updateProfile);

// обновляем аватар
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
