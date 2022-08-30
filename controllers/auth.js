import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config();

const oAuth2Client = new OAuth2Client(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    'postmessage',
);

export const googleToken = async (req, res) => {
    const { tokens } = await oAuth2Client.getToken(req.body.code);
    
    res.json(tokens);
}