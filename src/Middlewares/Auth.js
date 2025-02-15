const jwt = require('jsonwebtoken');
const createHttpError = require('http-errors');

const Auth = async (req,res,next) => {

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

        req.user = userPayload;
        next();

    } catch(e){
        next(e)
    }

}

module.exports = Auth;