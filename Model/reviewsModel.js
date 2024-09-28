//review/rating /created at /refto tour /ref user
const mongoose=require('mongoose');
 const reviewSchema=new mongoose.schema({
    createdAt:{
        type:Date,
        default:Date.now
    },
    review:{
        type:string,
        required:[true,'Review not be empty'],
    },
    rating:{
        type:number,
        max:5,
        min:1
    },
    tour:{
        type:mongoose.schema.ObjectId,
        ref:'Tour',
        required:[true,'review must belong to a tour']
    },
    user:{
        type:mongoose.schema.ObjectId,
        ref:'user',
        required:[true, 'Review must belong to a user']
    },
    // to make property that are not in db to be accesable in result also
    toJSON:{virtuals:true},
    toObject:{virtuals:true}

})
const Review=mongoose.model('Review',reviewSchema)
module.exports =mongoose.model()