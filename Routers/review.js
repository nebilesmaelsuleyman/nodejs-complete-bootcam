const express=require('express');
const Router=express.Router();
const reviewController=require('./../controllers/reviewController');
const authController =require('./../controllers/authController');

Router 
.route('/')
.get(reviewController.getAllReviews)
.post(
    authController.protected,
  
    reviewController.createReview
    )  
module.exports=Router