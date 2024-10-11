const Tour = require('./../Model/tourModel');
const catchAsync = require('./../utils/catchAsync');

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