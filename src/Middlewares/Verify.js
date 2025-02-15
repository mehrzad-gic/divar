const jwt = require('jsonwebtoken');
const createHttpError = require('http-errors');
const UserModel = require('../Modules/User/Model');

const Verify = async (req,res,next) => {

    try{

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
        const user = await UserModel.findOne({ email: userPayload.email });
        if (!user) throw new createHttpError.NotFound(_404);

        // Verify User.email_verified_at
        if(!user.email_verified_at) throw new createHttpError.Forbidden('You don not have access to this route');
        
        req.user = user;
        next();

    } catch(e){
        next(e)
    }

}

module.exports = Verify;