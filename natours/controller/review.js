// reviews controller

// reviews databse importation
import Review from '../model/reviewModel.js';

// asyncCatch error handling importation
import { catchAsync } from '../utils/catchAsync.js';

// app error importation
import AppError from '../utils/appError.js';

export const getAllReview = catchAsync(async (req, res, next) => {
  // to fliter out the number of reviews on each tours
  let filter = {}
  if(req.params.id) filter = {tour:req.params.id}
  const reviews = await Review.find(filter);
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

export const createReview = catchAsync(async (req, res, next) => {
  // to allow nested routes
  if(!req.body.tour) req.body.tour = req.params.id;
  if(!req.body.user) req.body.user = req.user.id 
  const review = await Review.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      review,
    },
  });
});
