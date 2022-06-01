import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

// @desc Auth User and Get Token
// @route GET /api/users/login
// @access Public
const userAuth = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //   console.log(req.body);
  const user = await User.findOne({ email });
  if (user) {
    if (await user.matchPassword(password)) {
      res.json({
        id: user._id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid password');
    }
  } else {
    res.status(401);
    throw new Error('User Email is not registered');
  }
});

// @desc Get User Profile
// @route GET /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  //   console.log(user);
  if (user) {
    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error('Not Authorised, Invalid Token.');
  }
});

// @desc Register User and Get Token
// @route POST /api/users/
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { email, name, password, isAdmin } = req.body;
  // console.log(req.body);
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(401);
    throw new Error('User already exists.');
  }

  const user = await User.create({
    email: email,
    name: name,
    password: password,
    isAdmin: isAdmin,
  });

  if (user) {
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid User Data');
  }
});

// @desc Update User Profile
// @route PUT /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  //   console.log(user);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.password = req.body.password || user.password;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      id: updatedUser._id,
      email: updatedUser.email,
      name: updatedUser.name,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Not Authorised, Invalid Token.');
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  const userList = await User.find({}).select('-password');

  if (userList) {
    res.json(userList);
  } else {
    res.status(500);
    throw new Error('Internal Server Error');
  }
});

const deleteUser = asyncHandler(async (req, res)=> {
  const user = await User.findById(req.user._id);
  //   console.log(user);
  if (user) {

    await User.deleteOne({_id: user._id});

    res.json({
      message: "User Deleted Successfully",
      user
    });
  } else {
    res.status(401);
    throw new Error('Not Authorised, Invalid Token.');
  }
});

export {
  userAuth,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getAllUsers,
  deleteUser
};
