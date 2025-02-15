const PostModel = require('./PostModel');
const CityModel = require('../City/CityModel');
const { CREATED, OK } = require("http-status-codes");
const createHttpError = require("http-errors");
const autoBind = require("auto-bind");
const crypto = require('crypto');

class PostController {

    constructor() {
        autoBind(this);
    }

    // Get all posts
    async all(req, res, next) {
        try {
            const posts = await PostModel.find({}, { _id: 0, __v: 0 })
                .populate('userId')
                .populate('category')
                .populate('city');
            res.status(OK).json({ data: posts });
        } catch (e) {
            next(e);
        }
    }

    // Create a new post
    async create(req, res, next) {
        try {
            const { title, userId, amount, content, category, province, city, district, address, coordinate, images, options } = req.body;

            // Validate required fields
            if (!title || !userId || !amount || !content || !category || !coordinate) {
                throw new createHttpError.BadRequest("Title, userId, amount, content, category, and coordinate are required.");
            }

            const slug = await this.makeSlug(title);
            const post = await PostModel.create({ title, userId, slug, amount, content, category, province, city, district, address, coordinate, images, options });

            res.status(CREATED).json({ message: "Post created successfully", data: post });
        } catch (e) {
            next(e);
        }
    }

    // Update a post by slug
    async update(req, res, next) {
        try {
            const { slug } = req.params;
            const { title, amount, content, category, province, city, district, address, coordinate, images, options } = req.body;

            const post = await this.checkExistBySlug(slug);

            if (!post) {
                throw new createHttpError.NotFound("Post not found.");
            }

            // Update fields
            if (title) {
                post.title = title;
                post.slug = await this.makeSlug(title);
            }
            if (amount) post.amount = amount;
            if (content) post.content = content;
            if (category) post.category = category;
            if (province) post.province = province;
            if (city) post.city = city;
            if (district) post.district = district;
            if (address) post.address = address;
            if (coordinate) post.coordinate = coordinate;
            if (images) post.images = images;
            if (options) post.options = options;

            await post.save();

            res.status(OK).json({ message: "Post updated successfully", data: post });
        } catch (e) {
            next(e);
        }
    }

    // Delete a post by slug
    async delete(req, res, next) {
        try {
            const { slug } = req.params;

            const post = await this.checkExistBySlug(slug);

            if (!post) {
                throw new createHttpError.NotFound("Post not found.");
            }

            await post.deleteOne();

            res.status(OK).json({ message: "Post deleted successfully" });
        } catch (e) {
            next(e);
        }
    }

    // Get post by slug
    async detail(req, res, next) {
        try {
            const { slug } = req.params;

            const post = await this.checkExistBySlug(slug);

            if (!post) {
                throw new createHttpError.NotFound("Post not found.");
            }

            res.status(OK).json({ data: post });
        } catch (e) {
            next(e);
        }
    }


    // Helper function to check if a post exists by slug
    async checkExistBySlug(slug) {
        const post = await PostModel.findOne({ slug }).populate('userId').populate('category').populate('city');
        return post ? post : false;
    }

    // Helper function to generate a unique slug
    async makeSlug(title) {
        let slug = title.trim().replace(/\s+/g, '-').toLowerCase();
        let randomChar = crypto.randomBytes(3).toString('hex').toUpperCase();

        while (await this.checkExistBySlug(slug)) {
            slug += `_${randomChar}`;
        }

        return slug;
    }

    async checkCategoryExist(id){
        const category = await CategoryModel.findOne({_id:id});
        return category ? category : false;
    }

    async checkCityExist(id){
        const city = await CityModel.findOne({_id:id});
        return city ? city : false;
    }

}

module.exports = new PostController();