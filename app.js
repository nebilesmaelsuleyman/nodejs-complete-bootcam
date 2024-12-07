/* eslint-disable prettier/prettier */

const fs=require("fs");
const morgan=require("morgan");
const express =require('express');
const path=require('path');
const app= express();
const helmet=require('helmet')
const cors =require('cors');


const tourRouter=require('./Routers/tour');
const reviewRouter=require('./Routers/review');
const userRouter=require('./Routers/user');
const viewRouter=require('./Routers/viewroutes');
const bookingRouter=require('./Routers/BookingRoutes');
const cookieParser = require('cookie-parser');

const AppError =require('./utils/appErro');
const rateLimit =require('express-rate-limit')
const mongosanitize=require('express-mongo-sanitize');
// const xss = require('xss-clean');
const hpp =require('hpp');
const GlobalErorHandler =require('./controllers/errorcontroller')
// middleware
//set security HHtp headers

app.set('view engine','pug');
app.set('views',path.join(__dirname,'views'
))

app.use(cookieParser());
app.use(helmet.contentSecurityPolicy({
  directives: {
    workerSrc: ['self', 'http://localhost:3000', 'blob:'],
    scriptSrc: ["'self'", 'https://cdnjs.cloudflare.com', 'https://browser.sentry-cdn.com'],
    connectSrc: ["'self'", "ws://localhost:*", "http://127.0.0.1:3000", "https://*.ingest.us.sentry.io"," ws://localhost:64885/ "]
  }
}));

// Body parser,reading data from body into req.body
app.use(express.json({limit:'15kb'} ));
app.use(express.urlencoded({extended:true, limit:'10kb'}))
//Data sanitization against nosql query injection



app.use(cors({
  origin:['http://localhost:3000',"ws://localhost:*"," ws://localhost:64885/ "],
  credentials: true
}))

app.use(mongosanitize());

//Data sanitization against xss
// app.use(xss());

// prevent parameter pollution
app.use(hpp(
  {
    whitelist:['duration','ratingsAverage',"ratingsQuantity","price"]
  }
));

const tours= JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

// to create limit of request from the same IP 
const limiter=rateLimit({
  max:100,
  windoMs:60*60*1000,
  message:'Too many requests from this IP,please try again in an hour!'
})

app.use('/api',limiter);

if(process .env.NODE_ENV === 'development'){
  app.use(morgan('dev'));
}
// test middleware
app.use((req,res,next)=>{
  req.requestTime =new Date().toISOString();
  
  
  // console.log(time);
  // console.log(req.headers)
  // console.log('the jwt form the cookie is below')
  // console.log(req.cookies.jwt)
  next()
})


// serving static files
app.use(express.static(path.join(__dirname,'public')))


// ROUTE HANDLER
// app.post('/api/v1/tours',create)
// app.get("/api/v1/tours/:id",getTour);
// app.post("/api/v1/tours",getAllTours)
// app.patch("api/v1/tours/:id",update)
// app.get('/api/v1/tours/',getAllTours)
//Routes 

app.use('/',viewRouter);
app.use("/api/v1/tours",tourRouter)
app.use('/api/v1/users',userRouter) 
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

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


