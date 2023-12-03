import { Router } from 'express';
import { VerifyMail, changePass, forgetPass, login, resendOtp, resendVerifyMail, signUp, verifyOtp } from '../controller/authController.js';
import middleware from '../middleware/middleware.js';
const appRoutes = Router();

appRoutes.get('/api/products', middleware, login);
appRoutes.get('/api/search/:query', middleware, signUp);

appRoutes.get('/api/cart', middleware, verifyOtp);
appRoutes.post('/api/cart', middleware, verifyOtp);
appRoutes.patch('/api/cart/:id', middleware, verifyOtp);
appRoutes.delete('/api/cart/:id', middleware, verifyOtp);

appRoutes.get('/api/wishlist', middleware, verifyOtp);
appRoutes.post('/api/wishlist', middleware, verifyOtp);
appRoutes.delete('/api/wishlist/:id', middleware, verifyOtp);


export default appRoutes;