import { Router } from 'express';
import middleware from '../middleware/middleware.js';
import { addToCart, cartData, removeFromCart } from '../controller/cartController.js';
import { getWishList, manageWishList } from '../controller/wishListController.js';
import { getPopulerProduct, getProductById, getProducts, searchProducts } from '../controller/productController.js';
const appRoutes = Router();

appRoutes.get('/api/product/:id', middleware, getProductById);
appRoutes.get('/api/products', middleware, getProducts);
appRoutes.get('/api/products/popular', middleware, getPopulerProduct);
appRoutes.get('/api/products/search/:query', middleware, searchProducts);

appRoutes.get('/api/cart', middleware, cartData);
appRoutes.patch('/api/cart', middleware, addToCart);
appRoutes.delete('/api/cart/:id', middleware, removeFromCart);

appRoutes.get('/api/wishlist', middleware, getWishList);
appRoutes.patch('/api/wishlist/:id', middleware, manageWishList);

export default appRoutes;