import postRoutes from './posts.js';
import userRoutes from './users.js';
import cors from 'cors';

const routers = (app) => {
    app.use(cors());
    app.use('/posts', postRoutes);
    app.use('/user', userRoutes);   
}

export default routers;