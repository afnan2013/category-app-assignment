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
  if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    const category = await Category.findById(req.params.id);

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
  if (req.body.parentId) {
    let validParent = req.body.parentId.match(/^[0-9a-fA-F]{24}$/);
    if (validParent) {
      const parent = await Category.findById(req.body.parentId);
      if (!parent) {
        res.status(400);
        throw new Error('ParentId Not Found');
      }
    } else {
      res.status(400);
      throw new Error('Invalid ParentId Request');
    }
  }
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
const deleteCategories = asyncHandler(async (req, res) => {
  if (req.params.id) {
    const categories = await Category.find({});
    let categoryList = [req.params.id];
    getNestedCategories(categories, req.params.id, categoryList);
    console.log(categoryList);

    await Category.deleteMany({ _id: { $in: categoryList } });
    res.json({
      message: 'Category Deleted Successfully',
      categoryList,
    });
  } else {
    res.status(400);
    throw new Error('Invalid Request');
  }
});

// @desc Update Single Category
// @route PUT /api/categories/:id
// @access Private
const updateCategory = asyncHandler(async (req, res) => {
  if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    if (req.body.parentId) {
      let validParent = req.body.parentId.match(/^[0-9a-fA-F]{24}$/);
      if (validParent) {
        const parent = await Category.findById(req.body.parentId);
        if (!parent) {
          res.status(400);
          throw new Error('ParentId Not Found');
        }
      } else {
        res.status(400);
        throw new Error('Invalid ParentId Request');
      }
    }

    const category = await Category.findById(req.params.id);

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
      category.parentId = req.body.parentId || category.parentId;

      const updatedCategory = await category.save();
      // console.log(updatedCategory);
      res.json({
        message: 'Updated Successfully',
        _id: category._id,
        name: category.name,
        slug: category.slug,
        parentId: category.parentId || null,
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
