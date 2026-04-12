const Book = require("../models/Book");

const createBook = async (req, res) => {
  try {
    const { title, author, status, pagesTotal, pagesRead, notes } = req.body;


    if (pagesRead > pagesTotal) {
      return res.status(400).json({
        error: "Pages read cannot be greater than total pages"
      });
    }

    const book = await Book.create({
      user: req.user, 
      title,
      author,
      status,
      pagesTotal,
      pagesRead,
      notes
    });

    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getBooks = async (req, res) => {
  try {
    const { search, status } = req.query;

    let filter = { user: req.user };

   
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } }
      ];
    }

  
    if (status && status !== "All") {
      filter.status = status;
    }

    const books = await Book.find(filter).sort({ createdAt: -1 });

    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getBook = async (req, res) => {
  try {
    const book = await Book.findOne({
      _id: req.params.id,
      user: req.user
    });

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const { pagesTotal, pagesRead } = req.body;

    if (pagesRead > pagesTotal) {
      return res.status(400).json({
        error: "Pages read cannot be greater than total pages"
      });
    }

    const updated = await Book.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user
      },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const deleted = await Book.findOneAndDelete({
      _id: req.params.id,
      user: req.user
    });

    if (!deleted) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createBook,
  getBooks,
  getBook,
  updateBook,
  deleteBook
};