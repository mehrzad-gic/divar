const CityModel = require('./CityModel');
const { CREATED, OK } = require("http-status-codes");
const createHttpError = require("http-errors");
const autoBind = require("auto-bind");
const crypto = require('crypto');

class CityController {

    constructor() {
        autoBind(this);
    }

    // Get all cities
    async all(req, res, next) {
        try {
            const cities = await CityModel.find({}, { _id: 0, __v: 0 });
            res.status(OK).json({ data: cities });
        } catch (e) {
            next(e);
        }
    }

    // Create a new city
    async create(req, res, next) {
        try {
            const { name, province } = req.body;

            // Validate required fields
            if (!name || !province) {
                throw new createHttpError.BadRequest("Name and province are required.");
            }

            const slug = await this.makeSlug(name);
            const city = await CityModel.create({ name, slug, province });

            res.status(CREATED).json({ message: "City created successfully", data: city });
        } catch (e) {
            next(e);
        }
    }

    // Update a city by slug
    async update(req, res, next) {
        try {
            const { slug } = req.params;
            const { name, status } = req.body;

            const city = await this.checkExistByField('slug', slug);

            if (!city) {
                throw new createHttpError.NotFound("City not found.");
            }

            if (name) {
                city.name = name;
            }
            if (status !== undefined) {
                city.status = status;
            }

            await city.save();

            res.status(OK).json({ message: "City updated successfully", data: city });
        } catch (e) {
            next(e);
        }
    }

    // Delete a city by slug
    async delete(req, res, next) {
        try {
            const { slug } = req.params;

            const city = await this.checkExistByField('slug', slug);

            if (!city) {
                throw new createHttpError.NotFound("City not found.");
            }

            await city.deleteOne();

            res.status(OK).json({ message: "City deleted successfully" });
        } catch (e) {
            next(e);
        }
    }

    // Get city by slug
    async detail(req, res, next) {
        try {
            const { slug } = req.params;

            const city = await this.checkExistByField('slug', slug);

            if (!city) {
                throw new createHttpError.NotFound("City not found.");
            }

            res.status(OK).json({ data: city });
        } catch (e) {
            next(e);
        }
    }

    // Change city status
    async changeStatus(req, res, next) {
        try {
            const { slug } = req.params;

            const city = await this.checkExistByField('slug', slug);

            if (!city) {
                throw new createHttpError.NotFound("City not found.");
            }

            city.status = !city.status;
            await city.save();

            res.status(OK).json({ message: "City status changed successfully", data: city });
        } catch (e) {
            next(e);
        }
    }


    // helper func ------------------------------
    async checkExistByField(filed,value) {
        const category = await CityModel.findOne({[filed] : value});
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

module.exports = new CityController();