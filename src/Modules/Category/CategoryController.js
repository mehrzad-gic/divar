const CategoryModel = require('./CategoryModel');

class CategoryController {

    async all(req, res, next) {
        try {
            const categories = await CategoryModel.find();
            res.json(categories);
        } catch (e) {
            next(e);
        }
    }

    async create(req, res, next) {
        try {
            const category = new CategoryModel(req.body);
            await category.save();
            res.status(201).json(category);
        } catch (e) {
            next(e);
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const category = await CategoryModel.findByIdAndUpdate(id, req.body, { new: true });
            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }
            res.json(category);
        } catch (e) {
            next(e);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const category = await CategoryModel.findByIdAndDelete(id);
            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }
            res.status(204).send();
        } catch (e) {
            next(e);
        }
    }

    async detail(req, res, next) {
        try {
            const { id } = req.params;
            const category = await CategoryModel.findById(id);
            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }
            res.json(category);
        } catch (e) {
            next(e);
        }
    }

    async changeStatus(req, res, next) {
        try {
            const { id } = req.params;
            const category = await CategoryModel.findById(id);
            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }
            category.status = !category.status;
            await category.save();
            res.json(category);
        } catch (e) {
            next(e);
        }
    }

    // helper func
    async checkExistById(id) {
        try {
            const category = await CategoryModel.findById(id);
            return !!category;
        } catch (e) {
            return false;
        }
    }
}

module.exports = new CategoryController();