const express =require('express')
const Router =express.Router();
const viewsController =require('./../controllers/viewController');
const { getOverview } = require('../controllers/viewController');
const authController=require('./../controllers/authController')
const bookingController=require('./../controllers/bookingController')



Router.get('/',bookingController.createBookingCheckout, authController.isLoggedIn,viewsController.getOverview);
Router.get('/tour/:slug',authController.isLoggedIn , viewsController.getTour)
Router .get('/login',authController.isLoggedIn, viewsController.logintemp)
Router.get('/me', authController.protected,authController.isLoggedIn,viewsController.getAccount)
Router.post('/submit-user-data', authController.protected,viewsController.updateUserData);

module.exports=Router