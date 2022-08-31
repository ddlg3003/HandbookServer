import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

dotenv.config();

const oAuth2Client = new OAuth2Client(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    'postmessage',
);

export const googleToken = async (req, res) => {
    const { tokens } = await oAuth2Client.getToken(req.body.code);
    const { sub, name, picture, email } = jwt.decode(tokens.id_token);

    res.json({ token: tokens.id_token, result: { sub, name, picture, email } });
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const existedUser = await User.findOne({ email });
        const isCorrectPassword = await bcrypt.compare(password, existedUser.password);

        if(!existedUser) res.status(404).json({ message: 'User not found' });

        else if(!isCorrectPassword) res.status(400).json({ message: 'Password mismatch' });

        else {
            const profile = {
                email: existedUser.email,  
                id: existedUser._id, 
                name: existedUser.name 
            }
            // 3 params: Object for encode, secret string, option object
            const token = jwt.sign(profile, process.env.JWT_CODE, { expiresIn: "1h" });
    
            res.status(200).json({ token, result: profile });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'something went wrong' });
    }
}

export const register = async (req, res) => {
    try {
        const { email, password, confirmPassword, firstName, lastName } = req.body;
  
        const existedUser = await User.findOne({ email });
    
        if(existedUser) res.status(400).json({ message: 'User already existed' });
    
        else if(password !== confirmPassword) res.status(400).json({ message: 'Passwords do not match' });
    
        else { 
            const hashedPassword = await bcrypt.hash(password, 12);
            const result = await User.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` });
            res.status(200).json({ message: `Registered successfully with email: ${result.email}` });
        }
    } catch (error) {
        res.status(500).json({ message: 'something went wrong' });
    }
}

