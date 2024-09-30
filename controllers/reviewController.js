const express =require('express');
const mongoose=require('mongoose');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appErro');
const Review=require('./../Model/reviewsModel')

exports.getAllReviews=catchAsync(async (req,res, next)=>{
    const reviews= await Review.find();
    res.status(200).json({
        status: 'succes',
        results:reviews.length,
        data:{
            reviews
        }
    })

});

exports.createReview = async (req,res, next)=>{
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;
    const reviews=await Review.create(req.body);
    res.status(200).json({
        status: 'succes',
        result:reviews.length,
        data:{
            reviews
        }
    })
}