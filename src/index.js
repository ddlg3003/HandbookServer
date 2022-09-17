import express from 'express';
import bodyParser from 'body-parser';
import connect from './config/database.js';
import routers from './routes/index.js';

const app = express();

// Config 
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

// API routes
routers(app);

// Connect db
connect(app);
// mongoose.set('useFindAndModify', false);
