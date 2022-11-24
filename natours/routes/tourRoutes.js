import express from 'express';
const tourRounter = express.Router();

// importing the user route which contain the middleware for protecting route
import { protect, restrictTo} from '../controller/auth.js';

// reviews controller importation
// import {getAllReview, createReview} from "../controller/review.js";

// importing review routes
import reviewRoute from "./reviewRoutes.js";

// importing users controllers function
import {

  getMonthlyPlan,
  getTourStats,
  topTours,
  getAllTour,
  CreateTour,
  getTourById,
  patchTour,
  deleteTour,
} from '../controller/tour.js';

// bringing events on id
// tourRounter.param('id', checkId);

// making use of the reviewRoute
// this approach is called mouting a router
tourRounter.use("/:id/reviews", reviewRoute);

// route to get the first 5 cheap tours
tourRounter.route('/top-5-cheap').get(protect, topTours, getAllTour);

// route to get the statistics perfrom on all tour e.g avgrating, avgprice, minprice, maxprice
tourRounter.route('/tour-stats').get(protect, getTourStats);

// route to get montly -plan activities
tourRounter.route('/montly-plan/:year').get(protect, restrictTo("admin", "lead-guild", "guild"), getMonthlyPlan);

// protect to check if user is login and have access to the route in question
// restrictTo means giving the user the right to perform a certain action
tourRounter.route('/').get(getAllTour).post(protect, restrictTo("admin", "lead-guild"), CreateTour);
tourRounter
  .route('/:id')
  .get(getTourById)
  .patch(protect, restrictTo("admin", "lead-guild"), patchTour)
  .delete(protect, restrictTo("admin", "lead-guild"), deleteTour);

// route to use tourid to get reviews
// tourRounter.route("/:tourid/reviews").post(protect, restrictTo("user"), createReview)

export default tourRounter;
