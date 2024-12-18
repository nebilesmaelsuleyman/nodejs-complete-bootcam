const express=require('express');
const Router=express.Router();
const bookingController=require('./../controllers/bookingController');
const authController =require('./../controllers/authController');

Router.get('/checkout-session/:tourId',authController.protected,bookingController.getCheckoutSession)
Router.use(authController.restrictTo('admin','lead-guide'))
Router
    .route('/')
    .get(bookingController.getAllBookings)
    .post(bookingController.createBooking)

Router
    .route('/:id')
    .get(bookingController.getBooking)
    .patch(bookingController.updateBooking)
    .delete(bookingController.deleteBooking)

module.exports=Router