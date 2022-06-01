import asyncHandler from 'express-async-handler';
import Category from '../models/categoryModel.js';
import slugify from 'slugify';
import { validateObjectId } from '../utils/commonUtils.js';

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
  return [...categoryList];
};

const getNestedCategories = (categories, parentId, categoryList) => {
  let eachlevelCategories = categories.filter(
    (category) => category.parentId == parentId
  );

  for (let cat of eachlevelCategories) {
    // console.log(cat.slug);
    categoryList.push(cat._id);
    getNestedCategories(categories, cat._id, categoryList);
  }

  return [...categoryList];
};

const searchCategories = (categories, allCategories) => {
  let categoryList = [];
  
  for (let cat of categories) {
    categoryList.push({
      _id: cat._id,
      name: cat.name,
      slug: cat.slug,
      parent: allCategories.filter((category)=> category._id.toString() === cat.parentId)
    });
  }
  return categoryList;
}

// @desc Fetch All Categories
// @route GET /api/categories
// @access Public
const getAllCategories = asyncHandler(async (req, res) => {
  const keyword = req.query.key ? {
    name: {
      $regex: req.query.key,
      $options: 'i'
    }
  }:{};
  const categories = await Category.find({...keyword});
  // console.log(categories);
  let categoryList = [];
  if (req.query.key){
    const allCategories = await Category.find({});
    categoryList = searchCategories(categories, allCategories);
  }else{
    // formatting categories list into nested categoryList
    categoryList = formatCategories(categories);
  }
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
  const id = req.params.id;
  if (validateObjectId(id)) {
    const category = await Category.findById(id);
    if (category) {
      res.json(category);
    } else {
      res.status(404);
      throw new Error('Category not found');
    }
  } else {
    res.status(400).json({ message: 'Invalid Category Request' });
  }
});

// @desc Add Single Category
// @route POST /api/categories/
// @access Private
const addCategory = asyncHandler(async (req, res) => {
  const parentId = req.body.parentId;
  
  if (req.body.name) {
    // checking Parent ID validity if it exixts in payload
    if (parentId) {
      if (validateObjectId(parentId)) {
        const parent = await Category.findById(parentId);
        if (!parent) {
          res.status(400);
          throw new Error('ParentId Not Found');
        }
      } else {
        res.status(400);
        throw new Error('Invalid ParentId Request');
      }
    }
    // checking slug uniqueness
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
const deleteCategories = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (validateObjectId(id)) {
    const fetchedcategory = await Category.findById(id);
    if (fetchedcategory){
      const categories = await Category.find({});
      let categoryList = [ifd];
      getNestedCategories(categories, req.params.id, categoryList);
      //console.log(categoryList);

      await Category.deleteMany({ _id: { $in: categoryList } });
      res.json({
        message: 'Category Deleted Successfully',
        categoryList,
      });
    }else{
      res.status(404);
      throw new Error('Category not Found');
    }
  } else {
    res.status(400);
    throw new Error('Invalid Request');
  }
});

// @desc Update Single Category
// @route PUT /api/categories/:id
// @access Private
const updateCategory = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const parentId = req.body.parentId;
  if (validateObjectId(id) && req.body.name) {
    // checking if parent is valid and exists or not
    if (parentId && parentId !== 'null') {
      if (validateObjectId(parentId)) {
        const parent = await Category.findById(parentId);
        if (!parent) {
          res.status(404);
          throw new Error('ParentId Not Found');
        }
      } else {
        res.status(400);
        throw new Error('Invalid ParentId Request');
      }
    }

    const category = await Category.findById(id);
    // slug uniqueness checking
    const slug =
      req.body.slug || req.body.name
        ? slugify(req.body.slug || req.body.name)
        : undefined;
    if (slug) {
      const categoryBySlug = await Category.findOne({ slug });

      if (categoryBySlug && category.slug !== slug) {
        res.status(400);
        throw new Error(
          'Slug Already Taken. Please Set a Different Category Name or Slug'
        ); 
      }
    }
    // console.log(category);
    if (category) {
      category.name = req.body.name || category.name;
      category.slug = slug || category.slug;
      if (parentId ==='null'){
        category.parentId = null;
      }else{
        category.parentId = req.body.parentId || category.parentId;
      }

      const updatedCategory = await category.save();
      // console.log(updatedCategory);
      res.json({
        message: 'Updated Successfully',
        _id: updatedCategory._id,
        name: updatedCategory.name,
        slug: updatedCategory.slug,
        parentId: updatedCategory.parentId || null,
      });
    } else {
      res.status(400);
      throw new Error('No Category Found');
    }
  } else {
    res.status(400);
    throw new Error('Invalid Request');
  }
});

export {
  getAllCategories,
  getCategoryById,
  addCategory,
  deleteCategories,
  updateCategory,
};
