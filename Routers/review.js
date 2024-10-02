const express=require('express');
//the below  code allows the review routes to aacces for another routes param (means id) 
const Router=express.Router({mergeParams:true});
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