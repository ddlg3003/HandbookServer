import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config(); 

const connect = (app) => {
    const CONNECTION_URL = process.env.CONNECTION_URL;
    const PORT = process.env.PORT || 5000;

    mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => app.listen(PORT, () => console.log(`Server listening on ${PORT}`)))
        .catch((ERROR) => console.log(`Server error: ${ERROR}`))
}

export default connect;