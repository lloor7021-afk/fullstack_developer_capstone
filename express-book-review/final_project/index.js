const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const { authenticated: customer_routes, jwtSecret } = require('./router/auth_users.js');
const { general: public_routes } = require('./router/general.js');

const app = express();
app.use(express.json());
app.use('/customer', session({
  secret: process.env.SESSION_SECRET || 'tutorial-only-change-this-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax' }
}));

app.use('/customer/auth', (req, res, next) => {
  const header = req.get('authorization');
  const token = req.session?.authorization?.token ||
    (header?.startsWith('Bearer ') ? header.slice(7) : undefined);
  if (!token) return res.status(401).json({ message: 'Log in to submit a review.' });
  try {
    req.user = jwt.verify(token, jwtSecret);
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired authentication token.' });
  }
});

app.use('/customer', customer_routes);
app.use('/', public_routes);

const PORT = Number(process.env.PORT) || 5000;
if (require.main === module) app.listen(PORT, () => console.log(`Book review server running at http://localhost:${PORT}`));
module.exports = app;
