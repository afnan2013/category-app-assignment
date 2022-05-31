import asyncHandler from 'express-async-handler';
import Category from '../models/categoryModel.js';
import slugify from 'slugify';

const formatCategories = (categories, parentId = null) => {
  const categoryList = [];
  let eachlevelCategories = categories.filter(
    (category) => category.parentId == parentId
  );
  for (let cat of eachlevelCategories) {
    categoryList.push({
      _id: cat._id,
      name: cat.name,
      slug: cat.slug,
      children: formatCategories(categories, cat._id),
    });
  }
  return categoryList;
};

// @desc Fetch All Categories
// @route GET /api/categories
// @access Public
const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  // res.status(401);
  // throw new Error('Not Authorised');
  const categoryList = formatCategories(categories);
  if (categoryList) {
    res.json({ categoryList });
  } else {
    res.status(500);
    throw new Error('Internal Server Error : getAllCategories()');
  }
});

// @desc Fetch Single Category
// @route GET /api/categories/:id
// @access Public
const getCategoryById = asyncHandler(async (req, res) => {
  // if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
  // } else {
  //   res.status(404).json({ message: 'Invalid Product Request' });
  // }
});

// @desc Add Single Category
// @route GET /api/categories/:id
// @access Private
const addCategory = asyncHandler(async (req, res) => {
  if (req.body.name) {
    const slug = slugify(req.body.slug ? req.body.slug : req.body.name);
    const category = await Category.find({ slug });
    if (category) {
      res.status(400);
      throw new Error(
        'Slug Already Taken. Please Set a Different Category Name or Slug'
      );
    } else {
      const newCategory = {
        name: req.body.name,
        slug: slug,
        parentId: req.body.parentId ? req.body.parentId : null,
      };
      const createdCategory = await Category.create(newCategory);
      if (createdCategory) {
        res.json(createdCategory);
      } else {
        res.status(500);
        throw new Error('Internal Server Error : addCategory()');
      }
    }
  } else {
    res.status(400);
    throw new Error('Invalid Request');
  }

  res.json({
    message: 'Found',
  });
});

export { getAllCategories, getCategoryById, addCategory };
