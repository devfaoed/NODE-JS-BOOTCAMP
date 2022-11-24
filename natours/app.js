import fs from 'fs';
import express from 'express';
const app = express();
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';

import path from 'path';
import { fileURLToPath } from 'url';

// importing appError created by myself
import AppError from './utils/appError.js';

// setting up middleware
// set security http headers middleware
app.use(helmet());

// dotenv configuration file
// development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// creating retelimit to limit specific user to perfoem too many action in a ceratin amount of time in our application
// limit request from same APi
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message:
    'Too many request from this IP address, please try again in an hour time',
});
app.use('/api', limiter);

// body parser i.e reading data from the body into req.body
app.use(express.json({ limit: '10kb' }));
// data sanitization against NOSQL query injection
app.use(mongoSanitize());
// data sanitization against cross-site sripting attack(XSS) attack
app.use(xss());

// middleware to prevent parameter pollution
// you use whitelist to allow the fileds where u want multiple result
// the goal here is to allow multiple fileds value input and get result
app.use(
  hpp({
    whitelist: ['duration',"ratingsAverage", "ratingsQuantity", "maxGroupSize", "difficulty", "price"]
  })
);
// setting up module to allow the use of {__dirnname}
const __filename = fileURLToPath(import.meta.url);
let __dirname = path.dirname(__filename);
// serving static file to express
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, "public")));

// test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// setting up pug template engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));


// // index route
// app.get('/', (req, res) => {
//   res.status(200).render('base', {
//     tour: "The Forest hicker",
//     user: "Broda Faith"
// });
// });

// app.get("/overview", (req, res) => {
//   res.status(200).render("overview", {title: "all tours"})
// })

// app.get("/tour", (req, res) => {
//   res.status(200).render("tour", {title: "the forest hicker tour"})
// })
// app.get('/api/v1/tours', getAllTour);

// getting tour by id
// app.get('/api/v1/tours/:id', getTourById);

//creating tour
// app.post('/api/v1/tours', CreateTour);

//using patch to update tour
// app.patch('/api/v1/tours/:id', patchTour);

//deleting a tour
// app.delete('/api/v1/tours/:id', deleteTour);

// simplifying our view route
// importing tourRoute from Route folder
import viewRoute from './routes/viewRoute.js';
app.use('/', viewRoute);

// simplifying our Tour route
// importing tourRoute from Route folder
import tourRounter from './routes/tourRoutes.js';
app.use('/api/v1/tours', tourRounter);

//users route
// importing userRoute from Route folder
import userRouter from './routes/userRoutes.js';
app.use('/api/v1/users', userRouter);


//review route
// importing reviewRoute from Route folder
import reviewRoute from './routes/reviewRoutes.js';
app.use('/api/v1/reviews', reviewRoute);

// route to render erorr 404 page
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `the requested page ${req.originalUrl} cant be found on the server!`,
  // });
  // const err = new Error(
  //   `the requested page ${req.originalUrl} cant be found on the server!`
  // );
  // err.status = 'fail';
  // err.statusCode = 404;

  next(
    new AppError(
      `the requested page ${req.originalUrl} cant be found on the server!`,
      404
    )
  );
});

// middleware function to handle erros
// app.use((err, req, res, next) => {
//   // initializing a default statuscode
//   err.statusCode = err.statusCode || 500;
//   // initializing status
//   err.status = err.status || 'error';

//   res.status(err.statusCode).json({
//     status: err.status,
//     message: err.message,
//   });
// });

// importing define error from the controller
import { globalError } from './controller/errorController.js';
app.use(globalError);

// exporting server where port is listenning
export default app;
