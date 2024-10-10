const express =require('express')
const Router =express.Router();
const viewsController =require('./../controllers/viewController');
const { getOverview } = require('../controllers/viewController');

Router.get('/',(req,res)=>{
    res.status(200).render('base',{
    tour:'the first hiker',
    user:'nebiloo'
    })
})
Router.get('/overview',getOverview);
Router.get('/tour/:slug',viewsController.getTour)

module.exports=Router