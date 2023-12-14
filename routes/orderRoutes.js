import { Router } from 'express';
import { cancelOrder, createOrder, myOrders, orderProducts, updateAddress } from '../controller/ordersController.js'
import middleware from '../middleware/middleware.js';
import { updateUserAddress } from '../controller/addressController.js';
const appRoutes = Router();

appRoutes.get('/api/myorders', middleware, myOrders);
appRoutes.get('/api/order/products', middleware, orderProducts);
appRoutes.patch('/api/address', middleware, updateUserAddress);

appRoutes.post('/api/order', middleware, createOrder);
appRoutes.post('/api/order/:id', middleware, updateAddress);
appRoutes.delete('/api/order/:id', middleware, cancelOrder);

export default appRoutes;