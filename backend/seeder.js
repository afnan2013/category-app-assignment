import dotenv from 'dotenv';
import mongoose from 'mongoose';
import colors from 'colors';

import users from './data/users.js';
import categories from './data/categories.js';
import User from './models/userModel.js';
import Category from './models/categoryModel.js';

import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Category.deleteMany();
    await User.deleteMany();

    await User.insertMany(users);

    await Category.insertMany(categories);

    console.log('Data Imported'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Category.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
