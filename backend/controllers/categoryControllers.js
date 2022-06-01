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

const getNestedDeleteCategories = (categories, parentId)=> {
  const categoryList = [];
  let eachlevelCategories = categories.filter(
    (category) => category.parentId == parentId
  );

  for (let cat of eachlevelCategories){
    console.log(cat.slug)
    getNestedDeleteCategories(categories, cat._id);
    categoryList.push(cat._id);
  }
  return categoryList;
}

// @desc Fetch All Categories
// @route GET /api/categories
// @access Public
const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({});
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
// @route POST /api/categories/
// @access Private
const addCategory = asyncHandler(async (req, res) => {
  if (req.body.name) {
    const slug = slugify(req.body.slug ? req.body.slug : req.body.name);
    const category = await Category.findOne({ slug });
    // console.log(category);
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
});


// @desc Delete Single Category and Cascade Nested Categories
// @route DELETE /api/categories/:id
// @access Private
const deleteCategories = asyncHandler(async (req, res)=> {
  if(req.params.id){
    const categories = await Category.find({});
    const categoryList = getNestedDeleteCategories(categories, req.params.id);
    console.log(categoryList);
    res.json(categoryList);
  }else {
    res.status(400);
    throw new Error('Invalid Request');
  }
});


export { getAllCategories, getCategoryById, addCategory, deleteCategories };
