const Tour = require('./../Model/tourModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appErro');
const factory=require('./handlerfactory')
const stripe=require('stripe')(process.env.STRIPE_SECRET_KEY)


exports.getCheckoutSession=catchAsync( async (req,res,next)=>{
    // 1Get teh currently booked user
    const tour= await Tour.findById(req.params.tourId)

    // 2 create checkout session


try {
    const session = await stripe.checkout.sessions.create({
        payment_method_types:['card'],
        mode:'payment',
        success_url:`${req.protocol}://${req.get('host')}/`,
        cancel_url:`${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email:req.user.email,
        client_reference_id:req.params.tourId,
        line_items:[{
            price_data:{
            currency:'usd',
            product_data:{
                name:`${tour.name}Tour`,
                description:tour.summary,
                images:[`https://www.natours.dev/img/tours/${tour.imageCover}`]
            },
            unit_amount:tour.price*100
            },
            quantity:1
        }]
      // ... (same checkout session options) ...
    });

    res.status(200).json({
    status: 'success',
    session,
    });
} catch (err) {
    // Log the error for debugging
    console.error(err);

    // Return a generic error response to the user
    return next(new AppError('Internal Server Error', 500));
}
});