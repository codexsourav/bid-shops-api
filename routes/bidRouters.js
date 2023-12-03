import { Router } from 'express';
import { VerifyMail, changePass, forgetPass, login, resendOtp, resendVerifyMail, signUp, verifyOtp } from '../controller/authController.js';
import middleware from '../middleware/middleware.js';
const appRoutes = Router();

appRoutes.get('/api/bids', middleware, login);
appRoutes.post('/api/newbid/:id', middleware, signUp);

appRoutes.get('/api/winners', middleware, verifyOtp);

export default appRoutes;