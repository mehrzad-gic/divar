const createHttpError = require("http-errors");
const UserModel = require("../User/model");
const { _403, otp_too_many, _404, user_already_exist, register_ok, login_ok, otp_has_expired, email_has_verified } = require("./AuthMessages");
const crypto = require('crypto');
const { CREATED, OK } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const autoBind = require("auto-bind");
const { sendMail } = require('../../Utils/NodeMailer'); // Adjust the path as needed

class AuthController {

    constructor() {
        autoBind(this);
    }

    async checkOtp(req, res, next) {

        try {

            // Verify token
            const token = req.headers['authorization'];
            if (!token) throw new createHttpError.Forbidden('Access denied. No token provided.');

            const tokenParts = token.split(' ');
            if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
                throw new createHttpError.Forbidden('Invalid token format.');
            }
            const userPayload = jwt.verify(tokenParts[1], process.env.SECRET_KEY);
            if (!userPayload) throw new createHttpError.Forbidden('Invalid token.');

            
            // Verify user
            const { code } = req.body;
            const user = await UserModel.findOne({ email: userPayload.email });
            if (!user) throw new createHttpError.NotFound(_404);


            // Verify OTP code
            const now = new Date().getTime();
            if (user.otp.expire < now) throw new createHttpError.Forbidden(otp_has_expired);
            if (user.otp.code !== code) throw new createHttpError.Forbidden(_403);

            user.email_verified_at = now;
            await user.save();

            return res.status(OK).json({ message: email_has_verified });

        } catch (e) {

            next(e);
        }

    }

    async sendOtp(req, res, next) {

        try {
            const { email } = req.body;
            const user = await UserModel.findOne({ email });

            // Check user
            if (!user) throw createHttpError.NotFound(_404);

            // Check OTP
            if (this.checkValidOtp(user)) throw new createHttpError.Forbidden(otp_too_many);

            // Generate 6-character code
            const code = crypto.randomBytes(3).toString('hex').toUpperCase();

            // Set expiration time to 2 minutes from now
            const expire = new Date().getTime() + 2 * 60 * 1000; // 2 minutes in milliseconds

            const otp = { code, expire };
            user.otp = otp;
            await user.save();

            // Send OTP via email
            const subject = 'Your OTP Code';
            const text = `Your OTP code is: ${code}. It will expire in 2 minutes.`;
            await sendMail(email, subject, text);

            res.status(OK).json({ message: 'OTP sent successfully', otp: code });
            
        } catch (e) {
            next(e);
        }
    }

    async register(req, res, next) {

        try {

            const { name, email, password } = req.body;

            const slug = await this.makeSlug(name);

            if (await this.checkExistByField("email", email)) throw new createHttpError.Forbidden(user_already_exist);

            const user = await UserModel.create({
                email,
                name,
                password: await this.makeHashPassword(password),
                slug,
            });

            res.status(CREATED).json({ message: register_ok });

        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const user = await this.checkExistByField('email', email);

            if (!user) throw new createHttpError.NotFound(_404);
            if (!await this.verifyHashPassword(user.password, password)) throw new createHttpError.Forbidden(_403);

            const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY, { expiresIn: '1y' });

            return res.status(OK).json({ message: login_ok, token });
        } catch (e) {
            next(e);
        }
    }

    // Helper methods

    async checkExistByField(field, value) {
        const user = await UserModel.findOne({ [field]: value });
        return user ? user : false;
    }

    async makeSlug(name) {

        let slug = name.trim().replace(/\s+/g, '-').toLowerCase();
        let randomChar = crypto.randomBytes(3).toString('hex').toUpperCase();

        while (await this.checkExistByField('slug', slug)) {

            slug += `_${randomChar}`;
        }

        return slug;
    }

    async makeHashPassword(password) {
        return crypto.createHash('sha256').update(password).digest('hex');
    }

    async verifyHashPassword(hash, password) {
        return hash === await this.makeHashPassword(password);
    }

    checkValidOtp(user) {
        const now = new Date().getTime();
        return user?.otp && user?.otp?.expire > now;
    }
}

module.exports = new AuthController();