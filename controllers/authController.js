const catchAsync = require('./../utils/catchAsync');
const user =require('./../Model/userModel' );
const jwt= require("jsonwebtoken");
const AppError = require('../utils/appErro');
const {promisify}=require('util');
const bcrypt = require('bcryptjs');
const sendEmail = require('./../utils/email');
const crypto =require('crypto')



const signToken = id => {
    return jwt.sign({ id }, process.env.jwt_secrte, {
      expiresIn: '10m'
    });
  }; 

  const createSendToken=(user,statusCode ,res)=>{
    const token = signToken(user._id);

    const cookieOptions ={
     
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true 
       // Only use in HTTPS environments
      };
    
    if (process.env. NODE_ENV=== 'production')cookieOptions.secure=true;
    
    res.cookie('jwt',token,cookieOptions)
    // remove password from outside;
    user.password=undefined
    res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        user: user
      }
    });
  
  }

  exports.signup = catchAsync(async (req, res, next) => {
    const { name,role, email, password, passwordConfirmation ,passwordChangedAt } = req.body;
  
    const newuser = await user.create({
      name,
      role,
      email,
      password,
      passwordConfirmation,
      passwordChangedAt
    });
  // var jsonData = pm.response.json();
  //   pm.environment.set("jwt", jsonData.token);

  createSendToken(newuser, 201, res); 

  });

  exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
  
    // 1) Check if email and password exist
    if (!email || !password) {
      return next(new AppError('Please provide email and password!', 400));
    }
    // 2) Check if user exists && password is correct
    const founduser = await user.findOne({ email }).select('+password');
    console.log(founduser)
    console.log('founduser pass:' , founduser.password)
    // ! (await founduser.correctPassword(password, founduser.password))
    if (!founduser ) {
      return next(new AppError(' incorrect email', 401));
    }
const ispasswordValid = await founduser.comparePassword({password})
if (!ispasswordValid){
  return next(new AppError('incorrect password',401))
}



    // 3) If everything ok, send token to client
    createSendToken(founduser, 200, res);
  });

exports.protected=catchAsync(async (req,res,next)=>{
    //  1 getting token check if it's there
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token =req.headers.authorization.split(' ')[1]
    }
    console.log(token)
    if(!token){
        return next(new AppError('your are not loged in  please login',401))
    }
    // 2 validate token

    const decoded= await promisify(jwt.verify)(token,process.env.jwt_secrte)
    console.log(decoded)


      // 3) Check if user still exists
      const currentUser = await user.findById(decoded.id);
      console.log(decoded.id)
      if (!currentUser) {
        return next(
          new AppError(
            'The user belonging to this token does no longer exist.',
            401
          )
        );
      }
      
  
    //4) check if user cahnged passwrod after the token was ussuied
    //  if(currentUser.changedaPasswordAfter(decoded.iat)){
    //   return next(new AppError('user recently changed password!,please login again',401))
    //  }
    
// Grant Acces to protected route
req.user= currentUser 
    next()
})


exports.restrictTo =(...roles)=>{
  return (req,res,next)=>{
    if(!roles.includes(req.user.role)){
      new AppError('you don not have permission to perform this action',403)
    }
  }
}



// exports.forgotPassword = catchAsync(async (req, res, next) => {
//   // 1) Get user based on POSTed email
//   const users = await user.findOne({ email: req.body.email });
//   console.log('user is', users)
//   if (!users) {
//     return next(new AppError('There is no user with email address.', 404));
//   }

//   // 2) Generate the random reset token
//   const resetToken = users.createPasswordResetToken();
//   await users.save({ validateBeforeSave: false });

//   // 3) Send it to user's email
//   const resetURL = `${req.protocol}://${req.get(
//     'host'
//   )}/api/v1/users/resetPassword/${resetToken}`;

//   const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

//   try {
//     await sendEmail({
//       email: user.email,
//       subject: 'Your password reset token (valid for 10 min)',
//       message
//     });

//     res.status(200).json({
//       status: 'success',
//       message: 'Token sent to email!'
//     });} catch (err) {
//       user.passwordResetToken = undefined;
//       user.passwordResetExpires = undefined;
//       await user.save({ validateBeforeSave: false });
  
//       return next(
//         new AppError('There was an error sending the email. Try again later!'),
//         500
//       );
//     }
//   });


exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const users = await user.findOne({ email: req.body.email });
  console.log(users);
  if (!users) {
    return next(new AppError('There is no user with email address.', 404));
  }

  // 2) Generate the random reset token
  console.log('this is start of part 2');
  const resetToken = await users.createPasswordResetToken();
  console.log("this is resettoken", resetToken);

  // Save the user with the generated token
  users.save({ validateBeforeSave: false });

  // Log the token after saving (resetToken is now available)
  console.log(`Your password reset token is: ${resetToken}. Use this token in the reset password endpoint.`);
  console.log('part is ended');
  res.status(200).json({
    status: 'success',
    resetToken,
    message: 'Token generated and logged to console. Check your console for the token.',
  });
});




exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const userss = await user.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  console.log(userss)
  // 2) If token has not expired, and there is user, set the new password
  if (!userss) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  userss.password = req.body.password;
  userss.passwordConfirm = req.body.passwordConfirm;
  userss.passwordResetToken = undefined;
  userss.passwordResetExpires = undefined;
  await userss.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  createSendToken(userss, 200, res);
});


exports.updatePassword =catchAsync( async (req,res, next)=>{
  //1 get user from  collection
//  we get the id from the jwt we are loged in 
    const  currentUser= await user.findById(req.user.id).select('+password');
      if(!currentUser)return next(new AppError('user not found',400))
        console.log("current user is:",currentUser)
  // 2 check if posted current password is correct
  console.log(req.body.passwordCurrent)
  console.log(currentUser.password)
  const isPasswordMatch =await currentUser.correctpasswords(req.body.passwordCurrent,currentUser.password);
  if(!isPasswordMatch)return next(new AppError('your current password is wrong',401));
  
  // 3 if so update, password
  // user.findByidAndupdate doesnot work as intended 
  currentUser.password= req.body.password;
  currentUser.passwordConfirmation= req.body.passwordConfirmation
  await currentUser.save();

  // 4 log user in , send jwt 
  createSendToken(currentUser,200,res)  

})
