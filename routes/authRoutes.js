import { Router } from 'express';
import { VerifyMail, changePass, forgetPass, login, resendOtp, resendVerifyMail, signUp, userProfile, verifyOtp } from '../controller/authController.js';
import middleware from '../middleware/middleware.js';
const appRoutes = Router();

appRoutes.post('/api/auth/login', login);
appRoutes.post('/api/auth/signup', signUp);

appRoutes.post('/api/auth/verifyotp', verifyOtp);
appRoutes.post('/api/auth/resendotp', resendOtp);

appRoutes.post('/api/auth/reset-password/:id', forgetPass);
appRoutes.put('/api/auth/reset-password/:token', changePass);

appRoutes.post('/api/auth/verify-email/:email', resendVerifyMail);
appRoutes.put('/api/auth/verify-email/:email', VerifyMail);


appRoutes.get('/api/profile', middleware, userProfile);


export default appRoutes;