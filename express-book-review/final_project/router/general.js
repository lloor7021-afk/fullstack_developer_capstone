const express = require('express');
const axios = require('axios');
const books = require('./booksdb.js');
const { registerUser } = require('./auth_users.js');

const public_users = express.Router();

public_users.post('/register', (req, res) => {
  const { username, password } = req.body || {};
  const result = registerUser(username, password);
  return res.status(result.status || 201).json({ message: result.message });
});

public_users.get('/', (req, res) => res.json(books));

public_users.get('/isbn/:isbn', (req, res) => {
  const book = books[req.params.isbn];
  return book ? res.json(book) : res.status(404).json({ message: 'Book not found.' });
});

public_users.get('/author/:author', (req, res) => {
  const author = req.params.author.toLowerCase();
  const matched = Object.fromEntries(Object.entries(books).filter(([, book]) =>
    book.author.toLowerCase() === author));
  return Object.keys(matched).length ? res.json(matched) : res.status(404).json({ message: 'No books found for author.' });
});

public_users.get('/title/:title', (req, res) => {
  const title = req.params.title.toLowerCase();
  const matched = Object.fromEntries(Object.entries(books).filter(([, book]) =>
    book.title.toLowerCase() === title));
  return Object.keys(matched).length ? res.json(matched) : res.status(404).json({ message: 'No books found for title.' });
});

public_users.get('/review/:isbn', (req, res) => {
  const book = books[req.params.isbn];
  return book ? res.json(book.reviews) : res.status(404).json({ message: 'Book not found.' });
});

// Task 11: demonstrate concurrent non-blocking API access using Axios and async/await.
// Calls return Promises and do not block other users while HTTP requests are in flight.
const baseURL = process.env.BOOK_API_URL || 'http://localhost:5000';
const client = axios.create({ baseURL, timeout: 5000 });
async function getAllBooks() {
  const { data } = await client.get('/');
  return data;
}
async function getBooksByISBN(isbn) {
  const { data } = await client.get(`/isbn/${encodeURIComponent(isbn)}`);
  return data;
}
async function getBooksByAuthor(author) {
  const { data } = await client.get(`/author/${encodeURIComponent(author)}`);
  return data;
}
async function getBooksByTitle(title) {
  const { data } = await client.get(`/title/${encodeURIComponent(title)}`);
  return data;
}
async function getBookReviews(isbn) {
  const { data } = await client.get(`/review/${encodeURIComponent(isbn)}`);
  return data;
}

module.exports = { general: public_users, getAllBooks, getBooksByISBN, getBooksByAuthor, getBooksByTitle, getBookReviews };
