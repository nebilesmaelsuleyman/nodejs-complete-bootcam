/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const slugify=require('slugify');
// const user= require('./userModel');

const tourschema = new mongoose.Schema({
  // _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true // Specify index creation in schema
  },
  slug:String,
  duration:{
    type:Number,
    required:[true, " a tour have duration"]
  },
  maxgroupSize:{
    type:Number,
    
  },
  difficulty:{
    type:String,
    required:[true, "have diffucltys"],
    enum:{
      values:['easy','medium', 'difficult'],
      message: 'difficulty is either :easy , medium or difficult '
    }
  },
  ratingsAverage:{
    type:Number,
    default:0,
    max:5,
    min:2
  },
  ratingsQuantity:{
    type:Number,
    default:0
  },
  description:{
    type:String,
    trim:true
  },
  imageCover:{
    type:String,
    required:true
  },
  images:[String],
  createdAt:{
    type:Date,
    default: Date.now()
  },
  startDates:[Date],
  discount:{
    type:Number,
    default:0
  },
  secretTour:{
    type:Boolean,
    default:false
  },
  priceDiscount:
  // custom validation to check if the given price is greater than the discount
  {type:Number,
    validate:{
      validator:function(val){
        return val < this.price;
      },
      message:'discount price ({VALUE} should be below regular price)'
    }

  }
  ,
  summary:{
    type:String,
    trim:true 
    
  },
  rating: {
    type: Number,
    default: 2.5,
  },
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true
  },
  price: {
    type: Number,
    required: [true, ' A tour must have a price'],
  },
  guides:[
    {type:mongoose.Schema.ObjectId,
      ref:'user'
    }
  ],

  startLocation: {
    // GeoJSON
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: [Number],
    address: String,
    description: String
  },
  locations: [
    {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String,
      day: Number
    }
  ],
},

{
  // inclussion of virtual property when converting document to json
  toJSON:{virtuals:true,
    // inclussion of virtual property when converting document to plainjavascript object
  toObject:{virtuals:true}
  }
})

tourschema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});


tourschema.pre('save', function(next) {
  console.log('slugify middleware is triggered')
  this.slug = slugify(this.name, { lower: true });
  next();
});

//if the relation was embeding we use this code 
// tourschema.pre('save', async function(next) {
//   // Create an array of Promises
//   const guidesPromises = this.guides.map(async (id) => {
//     return await user.findById(id);
//   });

//   // Wait for all promises to resolve and replace guides with user objects
//   this.guides = await Promise.all(guidesPromises);

//   next();
// });

// query middleware
// tourschema.pre(/^find/, function(next) {
//   this.find({ secretTour: { $ne: true } });

//   this.start = Date.now();
//   next();
// });

tourschema.pre(/^find/, function(next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});

tourschema.pre('/^find/',function(){
  // moddifies the current query by adding a codition that filters out any document
  // where there secrettour field is not equal to true .excludes the secret tour form the query results
  this.find({secretTour:{$ne:true}})
  this.start =Date.now()
  next();
})

tourschema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

// Aggregation Middleware
tourschema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

  console.log(this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', tourschema);

module.exports = Tour;
