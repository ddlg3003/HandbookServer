import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const auth = async (req, res, next) => {
    try {
        // Bearer jwt
        const token = req.headers.authorization.split(" ")[1];
        const isNormalAuth = token.length < 500;

        let decodedData;

        if(token && isNormalAuth) {
            decodedData = jwt.verify(token, process.env.JWT_CODE);
            req.userId = decodedData?.id;
        }
        else {
            decodedData = jwt.decode(token);
            req.userId = decodedData?.sub;
        }

        next();

    } catch (error) {
        res.status(401).json({ message: error.message });
    }
}

export default auth;