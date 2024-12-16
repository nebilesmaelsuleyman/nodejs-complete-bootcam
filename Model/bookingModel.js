const mongoose =require('mongoose');

const bookingSchema= new mongoose.Schema({
    tour:{
        type:mongoose.Schema.objectId,
        ref:'Tour',
        required: [true,'Booking mus belong to a Tour']
    },
    user:{
    type:mongoose.Schema.objectId,
    ref:'User',
    required:[true,'booking must belong to a user']
},
    price:{
        type:Number,
        required:[true, 'Booking must have a price']

},
createdAt:{
    type:Date,
    default:Date.now()
},
paid:{
    type:Boolean,
    default:true
}

})
bookingSchema.pre(/^find/,function(next){
    this.populate('user').populate({
        path:'tour',
        select:'name'
    }
        
        
    )
})

const Booking= mongoose.model('Booking',bookingSchema);

module.exports=Booking;