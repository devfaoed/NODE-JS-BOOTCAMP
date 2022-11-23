import express from 'express';
// making use of merge parameters to enable merging of parameters
// this is use for passing id whenever review router is callewd to be used in other router files
const reviewRoute = express.Router({mergeParams: true});

// review controller importation
import { getAllReview, createReview, deleteReview, updateReview, singleReview, setUserandTourId } from '../controller/review.js';

// auth contoller importation
import {protect, restrictTo} from "../controller/auth.js"

// route to all review
reviewRoute.route('/').get(getAllReview).post(protect, restrictTo("user"), setUserandTourId, createReview);

reviewRoute.route('/:id').get(singleReview).patch(updateReview).delete(deleteReview);

export default reviewRoute;
