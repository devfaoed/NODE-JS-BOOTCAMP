// reviews controller

// reviews databse importation
import Review from '../model/reviewModel.js';

// asyncCatch error handling importation
import { catchAsync } from '../utils/catchAsync.js';

// app error importation
import AppError from '../utils/appError.js';

// importing handler factory data funtion
import {deleteOne, updateOne, createOne, getOne, getAll} from "./handlerFactory.js";

export const getAllReview = getAll(Review)
// export const getAllReview = catchAsync(async (req, res, next) => {
//   // to fliter out the number of reviews on each tours
//   let filter = {}
//   if(req.params.id) filter = {tour:req.params.id}
//   const reviews = await Review.find(filter);
//   res.status(200).json({
//     status: 'success',
//     results: reviews.length,
//     data: {
//       reviews,
//     },
//   });
// });

export const setUserandTourId = (req, res, next) => {
   // to allow nested routes
   if(!req.body.tour) req.body.tour = req.params.id;
   if(!req.body.user) req.body.user = req.user.id 

   next()
}

export const createReview = createOne(Review)
// export const createReview = catchAsync(async (req, res, next) => {
//   // to allow nested routes
//   if(!req.body.tour) req.body.tour = req.params.id;
//   if(!req.body.user) req.body.user = req.user.id 
//   const review = await Review.create(req.body);
//   res.status(201).json({
//     status: 'success',
//     data: {
//       review,
//     },
//   });
// });

// export const deleteReview = catchAsync(async (req, res, next) => {
//   const id = req.params.id;
//   const review = await Review.findByIdAndRemove(id);

//   // to check if tour we are finding with the sepcified id exist
//   if (!deleteTour) {
//     return next(new AppError(`No tour found with the id of ${id}`, 404));
//   }

//   res.status(204).json({
//     status: 'success',
//     message: `tour with id ${id} deleted successfully`,
//     data: null,
//   });
// });

export const singleReview =  getOne(Review)
export const updateReview =  updateOne(Review)
export const deleteReview = deleteOne(Review)