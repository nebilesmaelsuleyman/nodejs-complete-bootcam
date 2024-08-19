/* eslint-disable prettier/prettier */
const fs=require("fs");

const morgan=require("morgan");

const express =require('express');

const app= express();

const tourRouter=require('./Routers/tour');

const userRouter=require('./Routers/user');

const AppError =require('./utils/appErro');

const GlobalErorHandler =require('./controllers/errorcontroller')
// middleware
app.use(express.json( ));

const tours= JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

if(process .env.NODE_ENV === 'development'){
  app.use(morgan('dev'));
}

app.use((req,res,next)=>{
  const time =req.requestTime =new Date().toISOString();
  console.log(time);
  console.log(req.headers)
  next()
})
app.use(express.static(`${__dirname}/public`))

app.get('/',(req,res)=>{
  res.send("mesage from server sides")
})
// ROUTE HANDLER
// app.post('/api/v1/tours',create)
// app.get("/api/v1/tours/:id",getTour);
// app.post("/api/v1/tours",getAllTours)
// app.patch("api/v1/tours/:id",update)
// app.get('/api/v1/tours/',getAllTours)
//Routes 
app.use    ("/api/v1/tours",tourRouter)
app.use('/api/v1/users',userRouter) 
// app.route('api/v1/users/:id').get(getUser).delete(deleteUser);

//  handle unreached route or route that doesnt exist 
        
app.all('*', (req,res,next)=>{
 
  // const err = new Error(`can't find ${req.originalUrl}on this server`)
  // err.status ='fail';
  // err.statuscode=400
  next(new AppError(`can't find ${req.originalUrl} on this server`,400))
})

// Global error handling
app.use(GlobalErorHandler)

module.exports=app;
 

