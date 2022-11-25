import express from 'express';

const viewRoute = express.Router();

// view contoller importation
import { getOverview, getTour } from '../controller/viewsController.js';

viewRoute.get('/', getOverview);

viewRoute.get('/tour/:name', getTour);

export default viewRoute;
