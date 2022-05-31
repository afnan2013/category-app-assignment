import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import morgan from 'morgan';
import connectDB from './config/db.js';

import { notFound, errorHandler } from './middlwares/errorMiddleware.js';

import userRoutes from './routes/userRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';

// Enviroment Variables
dotenv.config();

// Connect To MongoDb Config
connectDB();

const app = express();

// Allow JSON data to request and response APIs
app.use(express.json());

// Development Mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);

// Declaring Static Folder For accessing Files
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Production Mode
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('Rest API is running is Development Mode...');
  });
}

// Not Found Route Middlewares
app.use(notFound);

// Error Handler Middleware
app.use(errorHandler);

// PORT Declaration
const PORT = process.env.PORT || 5000;

// Live Server
app.listen(
  PORT,
  console.log(
    `Server is listeing in ${process.env.NODE_ENV} mode to ${PORT} Port`.yellow
  )
);
