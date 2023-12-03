import { Router } from 'express';
import upload from "../helper/UploadFile.js";

import { VerifyMail, changePass, forgetPass, login, resendOtp, resendVerifyMail, signUp, verifyOtp } from '../controller/authController.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
import { addProduct } from '../controller/productManegeController.js';
const appRoutes = Router();

appRoutes.post('/api/product', adminMiddleware, upload.fields([{ name: "image", maxCount: 1 }, { name: "gallery" }]), addProduct);
appRoutes.patch('/api/product', adminMiddleware, upload.fields([{ name: "image", maxCount: 1 }, { name: "gallery" }]), login);
// appRoutes.delete('/api/product', adminMiddleware, login);

// appRoutes.post('/api/bid', adminMiddleware, login);
// appRoutes.patch('/api/bid', adminMiddleware, login);
// appRoutes.delete('/api/bid', adminMiddleware, login);

// appRoutes.post('/api/users', adminMiddleware, login);
// appRoutes.patch('/api/user', adminMiddleware, login);
// appRoutes.delete('/api/user', adminMiddleware, login);

// appRoutes.get('/api/bidswinners', adminMiddleware, login);

export default appRoutes;