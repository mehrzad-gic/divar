const OptionModel = require('./OptionModel');
const { CREATED, OK } = require("http-status-codes");
const createHttpError = require("http-errors");
const autoBind = require("auto-bind");
const CategoryModel = require('../Category/CategoryModel.js');
const { isValidObjectId } = require('mongoose');

class OptionController {

    constructor() {
        autoBind(this);
    }

    // Helper function to check if an option exists
    async checkExistById(id) {
        return await OptionModel.findById(id); // Ensure this returns a Mongoose document
    }
    

    async checkCategoryExist(id){
        const category = await CategoryModel.findOne({_id:id});
        return category ? category : false;
    }

    // Get all options
    async all(req, res, next) {
        try {
            const options = await OptionModel.find({}, { _id: 0});
            res.status(OK).json({ data: options });
        } catch (e) {
            next(e);
        }
    }

    // Create a new option
    async create(req, res, next) {
        try {
            const { title, key, type, enum: enumValues, guid, required, category } = req.body;

            if(category){
                if(!isValidObjectId(category) || !await this.checkCategoryExist(category)) throw new createHttpError.NotFound('Category Not Found');
            }

            // Validate required fields
            if (!title || !key || !type || !category) {
                throw new createHttpError.BadRequest("Title, key, type, and category are required.");
            }

            const option = await OptionModel.create({ title, key, type, enum: enumValues, guid, required, category });
            res.status(CREATED).json({ message: "Option created successfully", data: option });
        } catch (e) {
            next(e);
        }
    }

    // Update an option by ID
    async update(req, res, next) {

        try {

            const { id } = req.params;
            const { title, key, type, enum: enumValues, guid, required, category } = req.body;
           
            const option = await this.checkExistById(id);

            if (!option) {
                throw new createHttpError.NotFound("Option not found.");
            }

            if(category && category != option.category){
                if(!isValidObjectId(category) || !await this.checkCategoryExist(category)) throw new createHttpError.NotFound('Category Not Found');
            }

            // Update fields
            if (title) option.title = title;
            if (key) option.key = key;
            if (type) option.type = type;
            if (enumValues) option.enum = enumValues;
            if (guid) option.guid = guid;
            if (required !== undefined) option.required = required;
            if (category) option.category = category;

            await option.save();

            res.status(OK).json({ message: "Option updated successfully", data: option });

        } catch (e) {
            next(e);
        }
    }

    // Delete an option by ID
    async delete(req, res, next) {
        try {
            const { id } = req.params;

            const option = await this.checkExistById(id);

            if (!option) {
                throw new createHttpError.NotFound("Option not found.");
            }

            await option.deleteOne();

            res.status(OK).json({ message: "Option deleted successfully" });
        } catch (e) {
            next(e);
        }
    }

    // Get option by ID
    async detail(req, res, next) {
        try {
            const { id } = req.params;

            // Fetch the option document
            const option = await this.checkExistById(id);

            if (!option) {
                throw new createHttpError.NotFound("Option not found.");
            }

            // Populate the category field
            const populatedOption = await option.populate('category');

            res.status(OK).json({ data: populatedOption });
        } catch (e) {
            next(e);
        }
    }


}

module.exports = new OptionController();