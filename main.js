import express from 'express';
import cookieParser from 'cookie-parser';
import cors from "cors";
import env from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import productsRoutes from "./routes/productsRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import bidRouters from "./routes/bidRouters.js";
import settingsRoutes from "./routes/settingsRoutes.js";

import upload from "./helper/UploadFile.js";
import middleware from './middleware/middleware.js';

env.config()

const app = express();

app.use(
    cors(),
    express.static("static"),
    express.static("static/uploads"),
    express.json(),
    express.urlencoded({ extended: true }),
    cookieParser(),
    authRoutes,
    productsRoutes,
    adminRoutes,
    orderRoutes,
    bidRouters,
    settingsRoutes,
);

app.post("/upload", middleware, upload.single("file"), async (req, res) => {
    res.send(req.file)
});

app.get("/heath", async (req, res) => {
    res.send({ "message": "Everything Is Healthy" });
});

app.get("/", async (req, res) => {
    res.send({
        "message": "Hi Welcome to Bid And Shops Api"
    });
});


const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server listening at ${process.env.HOST_URI}`);
});
