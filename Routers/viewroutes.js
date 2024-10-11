const express =require('express')
const Router =express.Router();
const viewsController =require('./../controllers/viewController');
const { getOverview } = require('../controllers/viewController');
const authController=require('./../controllers/authController')


// Router.use(authController.isLoggedIn);
Router.get('/',getOverview);
Router.get('/tour/:slug',viewsController.getTour)
Router .get('/login', viewsController.logintemp)

module.exports=Router