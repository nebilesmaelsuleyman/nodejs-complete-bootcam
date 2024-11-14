
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appErro');
const Review=require('./../Model/reviewsModel')
const factory=require('./../controllers/handlerfactory')

// exports.getAllReviews= catchAsync(async (req ,res,next)=>{
//     let filter = {};
//     if (req.params.tourId) filter = { tour: req.params.tourId };

//     const review=Review.find(filter)
//     res.status(200).json({
//         status:'succes',
//         result:review.length,
//         data:{
//             review
//         }
//     })
// })

exports.setTourUserId =(req,res,next)=>{
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;
    next();

}

exports.getAllReviews=factory.getAll(Review)
exports.createReview = factory.createOne(Review)
exports.getReview= factory.getOne(Review);
exports.updateReview=factory.updateOne(Review);
exports.deleteReview=factory.deleteOne(Review)