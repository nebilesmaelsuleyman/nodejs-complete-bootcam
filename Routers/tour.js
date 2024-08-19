/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
/* eslint-disable import/no-useless-path-segments */
/* eslint-disable prettier/prettier */
const express= require('express')
const authController=require('./../controllers/authController')

const Router =express.Router();
const tourcontroller=require('./../controllers/tourcontroller')

// Router.param("id",tourcontroller.checkid)

Router
.route('/Tour-stats')
.get(tourcontroller.getTourStats);
Router
.route('/top-5-cheap')
.get(tourcontroller.aliasTopTours , tourcontroller.getAllTours)

Router
.route('/monthly-plan-tour')
.get(tourcontroller.getMonthlyPlan)

Router
  .route("/")
  .get(authController.protected, tourcontroller.getAllTours)
  .post(tourcontroller.createTour)
  
Router 
  .route('/:id')
  .get(tourcontroller.getTour)
  .patch(tourcontroller.updateTour)
  .delete(authController.protected , authController.restricTo('admin','lead-guide'), tourcontroller.deleteTour)
  
  module.exports =Router