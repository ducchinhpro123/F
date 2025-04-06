// Import dependencies using ES module syntax
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import createError from 'http-errors';

// Import routes
import usersRouter from './routes/users.js';
import apiRouter from './routes/api.js';
import authRouter from './routes/auth.js';
import productsRouter from './routes/products.js';
import categoriesRouter from './routes/categories.js';

// Import MongoDB connection
import connect_mongodb from './database_configuration/ConnectMongodb.js';

// Initialize express app
const app = express();

// Connect to MongoDB
connect_mongodb();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(path.dirname(''), 'public')));  // Serving static files

// CORS configuration for React app
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
});

// Use routes
app.use('/users', usersRouter);
app.use('/api', apiRouter);
app.use('/auth', authRouter);
app.use('/products', productsRouter);
app.use('/categories', categoriesRouter);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  });
});

export default app;