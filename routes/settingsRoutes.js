import { Router } from 'express';
import middleware from '../middleware/middleware.js';
import { appStatus, setUpdatedMobile, updateEmail, updateMobile, updatePass, updateProfile } from '../controller/userSettingsController.js';
const appRoutes = Router();

appRoutes.get('/api/status', appStatus);

appRoutes.put('/api/settings/profile', middleware, updateProfile);
appRoutes.put('/api/settings/email', middleware, updateEmail);
appRoutes.post('/api/settings/mobile/:mobile', middleware, updateMobile);
appRoutes.put('/api/settings/mobile', middleware, setUpdatedMobile);
appRoutes.put('/api/settings/password', middleware, updatePass);

export default appRoutes;