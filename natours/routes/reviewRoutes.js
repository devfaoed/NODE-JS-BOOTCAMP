import express from 'express';
const reviewRoute = express.Router();

// review controller importation
import { getAllReview, createReview } from '../controller/review.js';

// auth contoller importation
import {protect, restrictTo} from "../controller/auth.js"

// route to all review
reviewRoute.route('/').get(getAllReview).post(protect, restrictTo("user"), createReview);

export default reviewRoute;
