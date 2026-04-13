const express = require('express');
const router = express.Router();

const {
  createBook,
  getBooks,
  getBook,
  updateBook,
  deleteBook
} = require('../controllers/bookController');

const auth = require('../middleware/authMiddleware');

router.use(auth);

router.post('/', createBook);
router.get('/', getBooks);
router.get('/:id', getBook);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

module.exports = router;