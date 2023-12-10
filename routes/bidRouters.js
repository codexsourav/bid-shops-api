import { Router } from 'express';
import middleware from '../middleware/middleware.js';
import { addNewBidAmount, getBidResults, getBids } from '../controller/bidController.js';
const appRoutes = Router();

appRoutes.get('/api/bids', middleware, getBids);
appRoutes.post('/api/bid/new/:id', middleware, addNewBidAmount);
appRoutes.get('/api/bid/result/:id', middleware, getBidResults);
appRoutes.get('/api/bid/winners/:id', middleware, (req, res) => { });

export default appRoutes;