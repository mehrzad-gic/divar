const { isValidObjectId } = require('mongoose');
const CategoryModel = require('./CategoryModel');
const { CREATED, OK } = require("http-status-codes");
const createHttpError = require("http-errors");
const crypto = require('crypto');
const autoBind = require("auto-bind");

class CategoryController {


    constructor() {
        autoBind(this);
    }


    async all(req, res, next) {
        try {
            const categories = await CategoryModel.find({},{_id:0});
            res.status(OK).json({data:categories});
        } catch (e) {
            next(e);
        }
    }

    async create(req, res, next) {

        try {

            const { name, des, icon,status, parent } = req.body;
    
            // Validate that 'name' is provided
            if (!name || typeof name !== 'string') {
                return res.status(400).json({ message: 'Name is required and must be a string.' });
            }
    
            const slug = await this.makeSlug(name);
            
            const categoryDTO = { name,status,des, icon, parent, slug, parents: [] };
    
            // Validate parent
            if (parent && isValidObjectId(parent)) {
                const existCat = await this.checkExistByField('_id', parent);
    
                if (!existCat) throw new createHttpError.NotFound("Category not found");
            }
    
            const category = await CategoryModel.create(categoryDTO);
    
            res.status(CREATED).json({ message: "Category created successfully", data: category });
    
        } catch (e) {

            next(e);
        }
    }
    

    async update(req, res, next) {

        try {

            const { slug } = req.params;
            
            const {name,des,icon,parent,status} = req.body;

            const categoryDTO = {name,des,icon,status,parent,parents:[]};

            const category = await this.checkExistByField("slug",slug)

            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }

            // validate parent
            if(parent && isValidObjectId(parent) && parent != category.parent ){

                const existCat = await this.checkExistByField('_id',parent);

                if(existCat == false) throw new createHttpError.NotFound("Category not found");
                
                //! useless now 
                // categoryDTO.parents = [...new Set(
                //     [existCat._id.toString()].concat(existCat.parents.map(id => id.toString()))
                //     .map(id => new Types.ObjectId(id))
                // )];
            }
            
            await category.updateOne(categoryDTO); // Use updateOne instead of update

            res.status(OK).json({message:"category Updated successfully",data : category});
        
        } catch (e) {
            
            next(e);
        }

    }

    async delete(req, res, next) {
        try {
            const { slug } = req.params;
            const category = await this.checkExistByField("slug",slug)
            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }
            await category.deleteOne(); // This will also remove its children
            res.status(OK).send({message:"category removed successfully"});
        } catch (e) {
            next(e);
        }
    }

    async detail(req, res, next) {

        try {
            const { slug } = req.params;
            const category = await this.checkExistByField("slug",slug)
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
            const { slug } = req.params;
            const category = await this.checkExistByField("slug",slug)
            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }
            category.status = !category.status;
            await category.save();
            res.status(OK).json({message:'category status changed',date:category});
        } catch (e) {
            next(e);
        }
    }



    // helper func ------------------------------
    async checkExistByField(filed,value) {
        const category = await CategoryModel.findOne({[filed] : value});
        return category ? category : false;
    }

    async makeSlug(name) {

        let slug = name.trim().replace(/\s+/g, '-').toLowerCase();
        let randomChar = crypto.randomBytes(3).toString('hex').toUpperCase();

        while (await this.checkExistByField('slug', slug)) {

            slug += `_${randomChar}`;
        }

        return slug;
    }
    
}

module.exports = new CategoryController();