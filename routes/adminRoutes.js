import { Router } from 'express';
import adminMiddleware from '../middleware/adminMiddleware.js';
import { addProduct, deleteProduct, updateProduct } from '../controller/productManegeController.js';
import { blockUsers, deleteUsers, getUsers, getVerifiedUsers } from '../controller/userManageController.js';
import { createNewBid, deleteBidById, getAllBids, getBidsBid, updateBidById } from '../controller/bidManagerController.js';
import { getOrdersWithProductData } from '../controller/ordersController.js';
import { adminLogin } from '../controller/authController.js';
import { dashbordData } from '../controller/adminDashbord.js';
const appRoutes = Router();

appRoutes.post('/api/admin/login', adminLogin);

appRoutes.get('/api/admin/dashbord', dashbordData);


appRoutes.post('/api/product', adminMiddleware, addProduct);
appRoutes.patch('/api/product/:id', adminMiddleware, updateProduct);
appRoutes.delete('/api/product/:id', adminMiddleware, deleteProduct);

appRoutes.get('/api/allbids', adminMiddleware, getAllBids);
appRoutes.get('/api/bid/:id', adminMiddleware, getBidsBid);
appRoutes.post('/api/bid', adminMiddleware, createNewBid);
appRoutes.patch('/api/bid/:id', adminMiddleware, updateBidById);
appRoutes.delete('/api/bid/:id', adminMiddleware, deleteBidById);

appRoutes.get('/api/users', adminMiddleware, getUsers);
appRoutes.get('/api/users/verified', adminMiddleware, getVerifiedUsers);

appRoutes.patch('/api/user/:id', adminMiddleware, blockUsers);
appRoutes.delete('/api/user/:id', adminMiddleware, deleteUsers);

appRoutes.get('/api/orders', adminMiddleware, getOrdersWithProductData);

// appRoutes.get('/api/bidswinners', adminMiddleware, login); getOrdersWithProductData

export default appRoutes;