import express from 'express';
const tourRounter = express.Router();

// importing users controllers function
import {
  checkId,
  getAllTour,
  CreateTour,
  getTourById,
  patchTour,
  deleteTour,
} from '../controller/tour.js';

// bringing events on id
// tourRounter.param('id', checkId);


tourRounter.route('/').get(getAllTour).post(CreateTour);
tourRounter.route('/:id').get(getTourById).patch(patchTour).delete(deleteTour);

export default tourRounter;
