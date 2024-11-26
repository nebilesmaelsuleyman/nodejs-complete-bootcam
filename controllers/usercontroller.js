/* eslint-disable prettier/prettier */
const User = require('./../Model/userModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appErro');
const factory=require('./../controllers/handlerfactory')
const multer=require('multer')

const multerStorage= multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,'public/img/users')
  },
 
  filename:(req,file,cb)=>{
    const ext = file.mimetype.split('/')[1];
    if (req.user) { cb(null, `user-${req.user.id}-${Date.now()}.${ext}`); } 
    else { cb(new Error('User information is not available'), false); }
  }
})

const multerFilter=(req, file,cb)=>{
  if(file.mimetype.startsWith('image')){
    cb(null,true);
    
  }else{
    cb(new AppError('Not an image! please upload only images',400),false);
  }
}

const upload= multer({
  storage:multerStorage,
  fileFilter:multerFilter
})

exports.uploaduserPhoto=upload.single('photo')

exports.getMe=(req, res,next)=>{
  req.params.id =req.user.id;
  next();
}

exports.getAllusers =factory.getAll(User)

const filterObj =(obj,...allowedFields)=>{
  const newObj ={};
  Object.keys(obj).forEach(el=>{
    if(allowedFields.includes(el))newObj[el]=obj[el];

  })
return newObj
}

exports.updateMe= catchAsync(async(req,res, next)=>{
  console.log(req.body)
  console.log(req.file)
// create error handler if the user try to change/post/ the password data 
if(req.body.password|| req.body.passwordConfirmation){
  return next(new AppError('this roure is not for password updates, please use /updatMypassword route',400 ))
}


// 3update the password
const filteredBody =filterObj(req.body, 'name','email');
if(req.file)filteredBody.photo=req.file.filename;


const updateUser =await User.findByIdAndUpdate(req.user.id,  filteredBody ,{new:true ,runvalidators:true})

res.status(200).json({
  status:'success',
  data:{
    user:updateUser
  }
})

});

exports.deleteMe =catchAsync(async(req,res,next)=>{
  await User.findByIdAndUpdate(req.user.id,{active:false});

  res.status(204).json({
    status:'succes',
    data:null
  })
})

// eslint-disable-next-line prettier/prettier

exports.getuser =factory.getOne(User);

exports.createuser = (req, res) => {
  res.status(500).json({
    status: 'err',
    message: 'this route is not yet defined ,use sign up route',
  });
};
exports.updateuser = factory.updateOne(User);

exports.deleteuser = (req, res) => {
  res.status(500).json({
    status: 'err',
    message: 'this route is not yet defined',
  });
};

