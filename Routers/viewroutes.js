const express =require('express')
const Router =express.Router();
const viewsController =require('./../controllers/viewController');
const { getOverview } = require('../controllers/viewController');
const authController=require('./../controllers/authController')



Router.get('/', authController.isLoggedIn,viewsController.getOverview);
Router.get('/tour/:slug',authController.isLoggedIn , viewsController.getTour)
Router .get('/login',authController.isLoggedIn, viewsController.logintemp)
Router.get('/me', authController.protected,viewsController.getAccount)

module.exports=Router