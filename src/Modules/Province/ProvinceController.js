const ProvinceModel = require('./ProvinceModel');
const { CREATED, OK } = require("http-status-codes");
const createHttpError = require("http-errors");
const crypto = require('crypto');
const autoBind = require("auto-bind");

class ProvinceController {

    constructor() {
        autoBind(this);
    }

    // Get all provinces
    async all(req, res, next) {
        
        try {
            const provinces = await ProvinceModel.find({}, { _id: 0}).populate('cities');
            res.status(OK).json({ data: provinces });
        } catch (e) {
            next(e);
        }
    }

    // Create a new province
    async create(req, res, next) {

        try {

            const { name, code, status } = req.body;

            if(await this.checkExistByField('code',code)) throw new createHttpError.Conflict('Province Already Exist');

            const slug = await this.makeSlug(name);

            // Validate required fields
            if (!name || !code ) {
                throw new createHttpError.BadRequest("Name, code are required.");
            }

            const province = await ProvinceModel.create({ name, code, status,slug });
            res.status(CREATED).json({ message: "Province created successfully", data: province });
        
        } catch (e) {

            next(e);
        }

    }

    // Update a province by ID
    async update(req, res, next) {

        try {

            const { slug } = req.params;
            const province = await this.checkExistByField("slug",slug);
            if (!province) {
                throw new createHttpError.NotFound("Province not found.");
            }

            const {name,status,code} = req.body;
            
            if(province.code != code){ 
                if(await this.checkExistByField('code',code)) throw new createHttpError.Conflict('Province Already Exist');
            }

            await province.updateOne({name,status,code})

            res.status(OK).json({ message: "Province updated successfully", data: province });

        } catch (e) {
            next(e);
        }

    }

    // Delete a province by ID
    async delete(req, res, next) {

        try {

            const { slug } = req.params;
            const province = await this.checkExistByField("slug",slug);
            if (!province) {
                throw new createHttpError.NotFound("Province not found.");
            }

            await province.deleteOne();

            res.status(OK).json({ message: "Province deleted successfully" });
        } catch (e) {
            next(e);
        }
    }

    // Get province by ID
    async detail(req, res, next) {

        try {

            const { slug } = req.params;
            const province = await this.checkExistByField("slug",slug);
            if (!province) {
                throw new createHttpError.NotFound("Province not found.");
            }

            res.status(OK).json({ data: province.populate('cities') });
        } catch (e) {
            next(e);
        }
    }

    // Change province status
    async changeStatus(req, res, next) {

        try {

            const { slug } = req.params;
            const province = await this.checkExistByField("slug",slug);
            if (!province) {
                throw new createHttpError.NotFound("Province not found.");
            }

            province.status = !province.status;
            await province.save();

            res.status(OK).json({ message: "Province status changed successfully", data: province });
        } catch (e) {
            next(e);
        }

    }


    // helper func ------------------------------
    async checkExistByField(filed,value) {
        const category = await ProvinceModel.findOne({[filed] : value});
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

module.exports = new ProvinceController();