import fs from 'fs';
import express from 'express';
const app = express();
import morgan from 'morgan';

// setting up middleware
// dotenv configuration file
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use((req, res, next) => {
  console.log('hello from middleware');
  next();
});

// serving static file to express
app.use(express.static(`./public`));

// index route
app.get('/', (req, res) => {
  res.status(200).redirect('/api/v1/tours');
});

// app.get('/api/v1/tours', getAllTour);

// getting tour by id
// app.get('/api/v1/tours/:id', getTourById);

//creating tour
// app.post('/api/v1/tours', CreateTour);

//using patch to update tour
// app.patch('/api/v1/tours/:id', patchTour);

//deleting a tour
// app.delete('/api/v1/tours/:id', deleteTour);

// simplifying our Tour route
// importing tourRoute from Route folder
import tourRounter from './routes/tourRoutes.js';
app.use('/api/v1/tours', tourRounter);

//users route
// importing userRoute from Route folder
import userRouter from './routes/userRoutes.js';
app.use('/api/v1/users', userRouter);

// exporting server where port is listenning
export default app;
