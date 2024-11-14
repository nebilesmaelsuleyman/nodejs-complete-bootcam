const Tour = require('./../Model/tourModel');
const catchAsync = require('./../utils/catchAsync');
const AppError=require('./../utils/appErro');
const user=require('./../Model/userModel');

exports.getOverview =catchAsync(async (req,res)=>{
    
const tours= await Tour.find( )

    res.status(200).render('overview',{
        title:"All tours",
        tours
    })
})
exports.getTour=catchAsync(async (req,res,next)=>{
    const tour =await Tour.findOne({slug:req.params.slug}).populate({
        path:'reviews',
        fields:'review rating user'
    });
    if(!tour){
        return next(new AppError('no tour with that name  ,not found'),404)
    }
    res.status(200).render('tour',{
        title:`${tour.name} Tour`,
        tour
    })

})
exports.logintemp= async (req,res)=>{
    console.log('login page ditected')
    res.status(200).render('login',{
        title:"login to your natours"
    })
    console.log('login ended')
    
}
exports.getAccount=async (req,res,)=>{
    res.status(200).render('account',{
        title:'your account'
    })
}

exports.updateUserData= catchAsync(async(req,res,next)=>{
    console.log('hey the form ' ,req.body)
    const updateduser=await user.findByIdAndUpdate(req.user.id,{
        name:req.body.name,
        emai:req.body.email
    },
{
    new:true,
    runValidators:true
})
res.status(200).render('account',{
    title:'your account',
    user:updateduser
})

})