const express=require('express');
//the below  code allows the review routes to aacces for another routes param (means id) 
const Router=express.Router({mergeParams:true});
const reviewController=require('./../controllers/reviewController');
const authController =require('./../controllers/authController');

Router 
.route('/')
.get(reviewController.getAllReviews)

//in the below code the reviewController.restrictTo() middleware are cousing long time request so i removed it 
.post(
    authController.protected,
    reviewController.setTourUserId,
    reviewController.createReview
    )  
Router
    .route('/:id')
    .get(reviewController.getReview)
    .patch( reviewController.updateReview)
module.exports=Router