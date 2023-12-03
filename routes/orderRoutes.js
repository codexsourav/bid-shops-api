import { Router } from 'express';
import { VerifyMail, changePass, forgetPass, login, resendOtp, resendVerifyMail, signUp, verifyOtp } from '../controller/authController.js';
import middleware from '../middleware/middleware.js';
const appRoutes = Router();

appRoutes.get('/api/address', middleware, login);
appRoutes.patch('/api/address', middleware, login);

appRoutes.post('/api/orders', middleware, verifyOtp);
appRoutes.post('/api/order', middleware, verifyOtp);
appRoutes.delete('/api/order/:id', middleware, verifyOtp);

export default appRoutes;