import { Router } from 'express';
import middleware from '../middleware/middleware.js';
import { addNewBidAmount, getBidResults, getBids, getSlides, getWinners } from '../controller/bidController.js';
const appRoutes = Router();

appRoutes.get('/api/bids', middleware, getBids);
appRoutes.get('/api/bids/slides', middleware, getSlides);
appRoutes.get('/api/bids/winners', middleware, getWinners);
appRoutes.post('/api/bid/new/:id', middleware, addNewBidAmount);
appRoutes.get('/api/bid/result/:id', middleware, getBidResults);

export default appRoutes;