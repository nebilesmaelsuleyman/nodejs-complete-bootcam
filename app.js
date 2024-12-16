/* eslint-disable prettier/prettier */

const fs=require("fs");
const morgan=require("morgan");
const express =require('express');
const path=require('path');
const app= express();
const helmet=require('helmet')
const cors =require('cors');
const os=require('os')


const tourRouter=require('./Routers/tour');
const reviewRouter=require('./Routers/review');
const userRouter=require('./Routers/user');
const viewRouter=require('./Routers/viewroutes');
const bookingRouter=require('./Routers/BookingRoutes');
const cookieParser = require('cookie-parser');

const AppError =require('./utils/appErro');
const rateLimit =require('express-rate-limit')
const mongosanitize=require('express-mongo-sanitize');
const stripe=require('stripe')
// const xss = require('xss-clean');
const hpp =require('hpp');
const GlobalErorHandler =require('./controllers/errorcontroller')
// middleware
//set security HHtp headers

app.use(cookieParser());

app.set('view engine','pug');
app.set('views',path.join(__dirname,'views'))
app.use(express.static(path.join(__dirname,'public')))

app.use((req, res, next) => { 
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization"); 
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true"); 
    if (req.method === "OPTIONS") {
      return res.sendStatus(200); } 
      next(); 
      });

app.use(cors({
  origin: ['http://localhost:3000', 'https://js.stripe.com/'],   // Adjust origins as needed
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['content-type', 'Authorization','credentials'],
  credentials: true
}));



// app.use(helmet());

app.use(helmet.contentSecurityPolicy({ 
  directives: { defaultSrc: ["'self'", "*"],
  scriptSrc: ["'self'", 'https://cdnjs.cloudflare.com', 'https://browser.sentry-cdn.com', 'https://js.stripe.com'], 
  styleSrc: ["'self'", 'https://fonts.googleapis.com', "'unsafe-inline'"],
    imgSrc: ["'self'", "data:"],
    connectSrc: ["'self'", "ws://localhost:*", "http://127.0.0.1:3000", "https://*.ingest.us.sentry.io", "ws://localhost:58166/" , "https://js.stripe.com"], 
    fontSrc: ["'self'", 'https://fonts.gstatic.com'],
    objectSrc: ["'none'"], 
    frameSrc: ["'self'", "https://js.stripe.com"], 
    workerSrc: ["'self'", 'http://localhost:3000', 'blob:'],
    baseUri: ["'self'"], formAction: ["'self'"] 
  } }));

app.use(express.json({limit:'15kb'} ));
app.use(express.urlencoded({extended:true, limit:'10kb'}))
//Data sanitization against nosql query injection




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


  console.log("cookie token from the app",req.cookies.jwt)
  next(new AppError(`can't find ${req.originalUrl} on this server`,400))
})

console.log(`platfrom:${os.platform()},Hostname:${os.hostname()}`)
console.log(`CPUs:${JSON.stringify(os.cpus())}`)
// Global error handling
app.use(GlobalErorHandler)

module.exports=app;


