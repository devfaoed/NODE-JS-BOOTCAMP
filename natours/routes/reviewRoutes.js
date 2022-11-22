import express from 'express';
// making use of merge parameters to enable merging of parameters
// this is use for passing id whenever review router is callewd to be used in other router files
const reviewRoute = express.Router({mergeParams: true});

// review controller importation
import { getAllReview, createReview } from '../controller/review.js';

// auth contoller importation
import {protect, restrictTo} from "../controller/auth.js"

// route to all review
reviewRoute.route('/').get(getAllReview).post(protect, restrictTo("user"), createReview);

export default reviewRoute;
