const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const books = require('./booksdb.js');

const regd_users = express.Router();
const users = [];
const jwtSecret = process.env.JWT_SECRET || 'development-only-replace-before-deployment';

function isValid(username) {
  return users.some((user) => user.username === username);
}

function authenticatedUser(username, password) {
  const user = users.find((entry) => entry.username === username);
  if (!user || typeof password !== 'string') return false;
  const hash = crypto.scryptSync(password, user.salt, 64);
  return crypto.timingSafeEqual(hash, Buffer.from(user.passwordHash, 'hex'));
}

function registerUser(username, password) {
  if (typeof username !== 'string' || username.trim().length < 3 ||
      typeof password !== 'string' || password.length < 8) {
    return { ok: false, status: 400, message: 'Username must be at least 3 characters and password at least 8.' };
  }
  if (isValid(username)) return { ok: false, status: 409, message: 'User already exists.' };
  const salt = crypto.randomBytes(16).toString('hex');
  users.push({ username, salt, passwordHash: crypto.scryptSync(password, salt, 64).toString('hex') });
  return { ok: true, message: 'User successfully registered.' };
}

regd_users.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!authenticatedUser(username, password)) return res.status(401).json({ message: 'Invalid credentials.' });
  const token = jwt.sign({ username }, jwtSecret, { expiresIn: '1h' });
  req.session.authorization = { token };
  return res.json({ message: 'User successfully logged in.' });
});

regd_users.put('/auth/review/:isbn', (req, res) => {
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ message: 'Book not found.' });
  const review = req.query.review ?? req.body?.review;
  if (typeof review !== 'string' || !review.trim()) {
    return res.status(400).json({ message: 'Provide a nonempty review.' });
  }
  const username = req.user.username;
  const previouslyReviewed = Object.prototype.hasOwnProperty.call(book.reviews, username);
  book.reviews[username] = review.trim();
  return res.json({ message: previouslyReviewed ? 'Review updated.' : 'Review added.', reviews: book.reviews });
});

regd_users.delete('/auth/review/:isbn', (req, res) => {
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ message: 'Book not found.' });
  if (!Object.prototype.hasOwnProperty.call(book.reviews, req.user.username)) {
    return res.status(404).json({ message: 'No review exists for this user.' });
  }
  delete book.reviews[req.user.username];
  return res.json({ message: 'Review deleted.', reviews: book.reviews });
});

module.exports = { authenticated: regd_users, isValid, authenticatedUser, registerUser, users, jwtSecret };
