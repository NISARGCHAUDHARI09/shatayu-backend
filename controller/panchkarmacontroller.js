// backend/controller/panchkarmacontroller.js
// Controller for Panchkarma categories and subcategories
const db = require('../modules'); // Adjust if your DB connection is elsewhere

// Get all Panchkarma categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await db.PanchkarmaMaster.findAll();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get subcategories for a category
exports.getSubcategories = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const subcategories = await db.PanchkarmaSubcategory.findAll({ where: { categoryId } });
    res.json(subcategories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new Panchkarma category
exports.createCategory = async (req, res) => {
  try {
    const category = await db.PanchkarmaMaster.create(req.body);
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new subcategory
exports.createSubcategory = async (req, res) => {
  try {
    const subcategory = await db.PanchkarmaSubcategory.create(req.body);
    res.status(201).json(subcategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Optionally: update/delete endpoints
