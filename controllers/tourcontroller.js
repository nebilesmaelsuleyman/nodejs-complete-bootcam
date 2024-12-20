const multer=require('multer')
const sharp=require('sharp')
const APIFeatures = require('./../utils/apiFeatures');
const Tour = require('./../Model/tourModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appErro');
const factory=require('./handlerfactory')

const Storage=multer.memoryStorage();

const Filter=(req, file,cb)=>{
  if(file.mimetype.startsWith('image')){
    cb(null,true);
    
  }else{
    cb(new AppError('Not an image! please upload only images',400),false);
  }
}

const upload= multer({
Storage:Storage,
fileFilter:Filter
})
exports.uploadTourImages=upload.fields([
  {name:'imageCover',maxCount:1},
  {name:'images',maxCount:3}
])

exports.resizeTourImages=catchAsync(async(req,res,next)=>{
  console.log(req.files)
  if(!req.files.imageCover ||req.file.images )return next();

 // 1)coverimages
  req.body.imageCover=`tour-${req.params.id}-${Date.now()}-cover.jpeg`
  await sharp(req.file.imageCover[0].buffer)
    .resize(2000,1333)
    .toFormat('jpeg')
    .jpeg({quality:90})
    .toFile(`public/img/tours/${req.body.imageCover}`);


  // 2) images
  req.body.images=[]
  await promise.all(
    req.file.images.map(async(file,i)=>{
      const filename=`tour-${req.params.id}-${Date.now()}-${i+1}.jpeg`

      await sharp(req.files.buffer)
        .resize(2000,1333)
        .toFormat('jpeg')
        .jpeg({quality:90})
        .toFile(`public/img/tours/${filename}`)

        req.body.images.push(filename);
    })
  );

  next();
})


exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id).populate('reviews')
  // Tour.findOne({ _id: req.params.id })
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }
  res.status(200).json({ 
    status: 'success',
    data: {
      tour
    }
  });
});

exports.createTour = factory.createOne(Tour)

exports.updateTour=factory.updateOne(Tour)

exports.deleteTour=factory.deleteOne(Tour);  

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1 }
    }
    // {
    //   $match: { _id: { $ne: 'EASY' } }
    // }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1; // 2021

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: { numTourStarts: -1 }
    },
    {
      $limit: 12
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan
    }
  });
});


// /tours-within/:distance/center/:latlng/unit/:unit
// /tours-within/233/center/34.111745,-118.113491/unit/mi
exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitutr and longitude in the format lat,lng.',
        400
      )
    );
  }

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours
    }
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitutr and longitude in the format lat,lng.',
        400
      )
    );
  }

  const distance = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1]
        },
        distanceField: 'distance',
        distanceMultiplier:multiplier
      }
    },
    {
      $project: {
        distance: 1,
        name: 1
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: distance
    }
  });
});
