// backend/routes/panchkarmaroutes.js
const express = require('express');
const router = express.Router();
const panchkarmaController = require('../controller/panchkarmacontroller');

// Get all Panchkarma categories
router.get('/categories', panchkarmaController.getCategories);

// Get subcategories for a category
router.get('/categories/:categoryId/subcategories', panchkarmaController.getSubcategories);

// Create a new Panchkarma category
router.post('/categories', panchkarmaController.createCategory);

// Create a new subcategory
router.post('/subcategories', panchkarmaController.createSubcategory);

// Optionally: update/delete endpoints

module.exports = router;
