/* eslint-disable prettier/prettier */
const User = require('./../Model/userModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appErro');

exports.getAllusers = catchAsync(async (req, res,next) => {

  const user= await User.find( )

  res.status(200).json({
    status: 'sucess',
  result:User.length,
    data:{
      user
    }
  });

});
const filterObj =(obj,...allowedFields)=>{
  const newObj ={};
  Object.keys(obj).forEach(el=>{
    if(allowedFields.includes(el))newObj[el]=obj[el];

  })
return newObj
}

exports.updateMe= catchAsync(async(req,res, next)=>{
// create error handler if the user try to change/post/ the password data 
if(req.body.password|| req.body.passwordConfirmation){
  return next(new AppError('this roure is not for password updates, please use /updatMypassword route',400 ))
}


// 3update the password
const filteredBody =filterObj(req.body, 'name','email');
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
exports.getuser = (req, res) => {
  res.status(500).json({
    status: 'err',
    message: 'this route is not yet defined',
  });
};
exports.createuser = (req, res) => {
  res.status(500).json({
    status: 'err',
    message: 'this route is not yet defined',
  });
};
exports.updateuser = (req, res) => {
  res.status(500).json({
    status: 'err',
    message: 'this route is not yet defined',
  });
};
exports.deleteuser = (req, res) => {
  res.status(500).json({
    status: 'err',
    message: 'this route is not yet defined',
  });
};
