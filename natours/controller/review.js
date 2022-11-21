// reviews controller

// reviews databse importation
import Review from '../model/reviewModel.js';

// asyncCatch error handling importation
import { catchAsync } from '../utils/catchAsync.js';

// app error importation
import AppError from '../utils/appError.js';

export const getAllReview = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

export const createReview = catchAsync(async (req, res, next) => {
  const data = req.body;
  const review = await Review.create(data);
  res.status(201).json({
    status: 'success',
    data: {
      review,
    },
  });
});
