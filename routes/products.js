const express = require('express');
const {getProducts, getProduct, createProduct, updateProduct, deleteProduct} = require('../controllers/products');
const advancedResults = require('../middleware/advancedResults');
const Product = require('../models/Product');

// dodavanje middleware fja
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/').get(advancedResults(Product), getProducts).post(protect, createProduct);
router.route('/:id').get(getProduct).put(protect, updateProduct).delete(protect, deleteProduct);

module.exports = router;