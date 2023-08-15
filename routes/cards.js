const router = require('express').Router();

const {
  getAllCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
} = require('../controllers/cards');

// получаем все карточки
router.get('/cards', getAllCards);

// создаем новую карточку
router.post('/cards', createCard);

// удаляем карточку по id карточки
router.delete('/cards/:cardId', deleteCard);

// ставим лайк
router.put('/cards/:cardId/likes', putLike);

// убираем лайк
router.delete('/cards/:cardId/likes', deleteLike);

module.exports = router;
