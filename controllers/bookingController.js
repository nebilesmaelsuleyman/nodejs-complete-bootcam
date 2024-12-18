const Tour = require('./../Model/tourModel');
const Booking = require('./../Model/bookingModel');
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
        success_url:`${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
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

exports.createBookingCheckout = catchAsync(async (req,res,next)=>{
  //this is only temporary ,because everyone can take booking wit out paying

    const {tour,user,price} =req.query;
    if(!tour && !price && !user)return next();
    await Booking.create({tour,user,price});
    res.redirect(req.originalUrl.split('?')[0])
    next()
})
exports.updateBooking=catchAsync(async(req,res,next)=>{
    const booking=Booking.findByIdAndUpdate(req.Booking.id)
    if(!booking){
        return next(new AppError('no seach booking found',404))
    }
    res.status(202).json({
        status:'succes',
        booking
    })
    next( )
})
 
exports.createBooking=factory.createOne(Booking);
exports.getBooking= factory.getOne(Booking)
exports.getAllBookings=factory.getAll(Booking);
exports.updateBooking=factory.updateOne(Booking);
exports.deleteBooking=factory.deleteOne(Booking)