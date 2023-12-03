import express from 'express';
import cookieParser from 'cookie-parser';
import cors from "cors";
import env from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import upload from "./helper/UploadFile.js";
import middleware from './middleware/middleware.js';
env.config()

const app = express();

app.use(
    express.static("static"),
    express.static("static/uploads"),
    express.json(),
    express.urlencoded({ extended: true }),
    cors(),
    cookieParser(),
    authRoutes,
    adminRoutes,
);

app.get("/", middleware, async (req, res) => {
    res.send("Hello")
});



const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server listening at ${process.env.HOST_URI}`);
});
