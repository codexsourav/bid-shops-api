import mongoose from 'mongoose'
import env from "dotenv";
env.config()

mongoose.connect(process.env.MONGODBURI).then(() => {
    console.log('DB Connected');
}).catch((err) => {
    console.log('DB Errro ' + err);
});