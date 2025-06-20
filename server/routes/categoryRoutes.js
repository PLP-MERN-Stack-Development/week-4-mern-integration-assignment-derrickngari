const express = require("express");
const router = express.Router();
const { 
    addCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
 } = require('../controllers/categoryControllers')

router.post('/category', addCategory)
router.get('/category', getAllCategories)
router.get('/category/:id', getCategoryById)
router.put('/category/:id', updateCategory)
router.delete('/category/:id', deleteCategory)

module.exports = router;