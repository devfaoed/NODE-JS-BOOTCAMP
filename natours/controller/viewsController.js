// tour model importation
import Tour from '../model/tourModel.js';

// asyncCatch error handling importation
import { catchAsync } from '../utils/catchAsync.js';

export const getOverview = catchAsync(async(req, res) => {
  const tours = await Tour.find();
    res.status(200).render("overview", {
      title: "all tours",
      tours
  })
  })
export const getTour =  catchAsync(async(req, res) => {
  const singleTour = await Tour.findOne({name:req.params.name}).populate({
    path: "reviews",
    fields: "review rating user"
  });
    res.status(200).render('tour', { title: 'the forest hicker tour', singleTour});
  })