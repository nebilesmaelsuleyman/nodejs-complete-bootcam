
const mongoose = require('mongoose');
const Tour =require('./tourModel');
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    tour: {
      type:mongoose.Schema.ObjectId,
      ref: 'Tour', // Referencing the Tour model
      required: [true, 'Review must belong to a Tour']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'user',
      required: [true, 'Review must belong to a user']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

//the below code make the request to take longer time 
// reviewSchema.pre(/^find/, function(next) {
//   this.populate({
//     path:'user',
//     select:'name'
//   })
// })
reviewSchema.statics.calclAverageRatings = async function(tourId){
    const states= await this.aggregate([
    {
    $match : {tour:tourId}
    },
    {
      $group:{
        _id:'$tour',
        nRating:{$sum:1},
        avgRating:{$avg:'$rating'}
      }
    }
  ])
  console.log(states)
  await Tour.findByIdAndUpdate(tourId,{
    ratingsQuantity:states[0].nRating,
    ratingsAverage:states[0].avgRating
  })
}

reviewSchema.post('save',function(){
  //the problem with the below code is the Review is not still defined so we make a change 
 // Review.calclAverageRatings(this.tour)
// the correction is 
  this.constructor.calclAverageRatings(this.tour);
})



const Review = mongoose.model('Review', reviewSchema);
module.exports = Review