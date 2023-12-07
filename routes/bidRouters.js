import { Router } from 'express';
import { VerifyMail, changePass, forgetPass, login, resendOtp, resendVerifyMail, signUp, verifyOtp } from '../controller/authController.js';
import middleware from '../middleware/middleware.js';
import { addNewBidAmount, getBids } from '../controller/bidController.js';
const appRoutes = Router();

appRoutes.get('/api/bids', middleware, getBids);
appRoutes.post('/api/bid/new/:id', middleware, addNewBidAmount);

appRoutes.get('/api/bid/winners/:id', middleware, verifyOtp);

export default appRoutes;