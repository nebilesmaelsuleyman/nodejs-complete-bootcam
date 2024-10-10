const express =require('express')
const Router =express.Router();
const viewsController =require('./../controllers/viewController');
const { getOverview } = require('../controllers/viewController');


Router.get('/',getOverview);
Router.get('/tour/:slug',viewsController.getTour)

module.exports=Router