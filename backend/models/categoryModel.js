import mongoose from 'mongoose';

const categorySchema = mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  parentId: {
    type: String,
    default: undefined,
  },
});

const Category = mongoose.model('Category', categorySchema);
export default Category;
