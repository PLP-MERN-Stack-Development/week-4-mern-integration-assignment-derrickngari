const Category = require('../models/categoryModel')

exports.addCategory = async (req, res) => {
    try {
        const category = new Category(req.body)
        await category.save()
        res.status(200).json({ message: "Category added successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find()
        if (!categories) return res.status(404).json({ message: "No categories found" });

        res.status(200).json(categories)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

exports.getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);
        if (!category) return res.status(404).json({ message: "No category found" });
        res.status(200).json(category);
    } catch (error) {
        res.status(400).json({ message: error.message })
    }

}

exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByIdAndUpdate(id, req.body, { new: true });
        if (!category) return res.status(404).json({ message: "No category found" });
        res.status(200).json({ message: "Category updated successfully" });
    } catch (error) {
        
    }
}

exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByIdAndDelete(id);
        if (!category) return res.status(404).json({ message: "No category found" });
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
       res.status(400).json({ message: error.message });
    }
}