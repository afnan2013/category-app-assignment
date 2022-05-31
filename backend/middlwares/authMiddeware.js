import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const protect = asyncHandler(async (req, res, next) => {
  // console.log(req.headers.authorization);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    const token = req.headers.authorization.split(' ')[1];
    const { id } = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // console.log(id);

    const user = await User.findById(id).select('-password');
    if (user) {
      req.user = {
        _id: user._id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
      };
      next();
    } else {
      res.status(401);
      throw new Error('Not Authorised, Invalid Token.');
    }
  } else {
    res.status(401);
    throw new Error('Not Authorised, Token is not found.');
  }
});

export { protect };
