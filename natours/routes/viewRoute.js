import express from 'express';

const viewRoute = express.Router();

// view contoller importation
import { getOverview, getTour } from '../controller/viewsController.js';

viewRoute.get('/overview', getOverview);

viewRoute.get('/tour', getTour);

export default viewRoute;
