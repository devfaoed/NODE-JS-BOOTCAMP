// asyncCatch error handling importation
import { catchAsync } from '../utils/catchAsync.js';

// api  query features importation
import APIFeatures from '../utils/apiFeatures.js';
// app error importation
import AppError from '../utils/appError.js';


export const deleteOne = Model => catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const doc = await Model.findByIdAndDelete(id);
  
    // to check if tour we are finding with the sepcified id exist
    if (!doc) {
      return next(new AppError(`No document found with the id of ${id}`, 404));
    }
  
    res.status(204).json({
      status: 'success',
      message: `tour with id ${id} deleted successfully`,
      data: null,
    });
  });

export const updateOne = Model => catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const doc = await Model.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  // to check if tour we are finding with the sepcified id exist
  if (!doc) {
    return next(new AppError(`No document found with the id of ${id}`, 404));
  }

  res.status(200).json({
    status: 'success',
    message: `doc with id ${id} updated successfully`,
    data: {
      tour: doc,
    },
  })
});

export const createOne = Model => catchAsync(async (req, res, next) => {
  const doc = await Model.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      doc,
    },
  });
})

// for adding populate options
export const getOne = (Model, popOptions) => catchAsync(async (req, res, next) => {
  const id = req.params.id;
  let query =  Model.findById(id);
  if(popOptions) query = query.populate(popOptions)
  const docs = await query;
  // to check if tour we are finding with the sepcified id exist
  if (!docs) {
    return next(new AppError(`No docs found with the id of ${id}`, 404));
  }
  res.status(200).json({
    status: 'success',
    message: ` docs ${id} find successfully`,
    data: {
      data: docs,
    },
  });
})

export const getAll = Model => catchAsync(async (req, res, next) => {
   // to fliter out the number of reviews on each tours to allow GET reviews on tours
   let filter = {}
   if(req.params.id) filter = {tour:req.params.id}
  // executing query command
  // const getTour = await query;
  const features = new APIFeatures(Model.find(filter), req.query)
    .filter()
    .sort()
    .limitField()
    .pagination();
  const doc = await features.query;
  res.status(200).send({
    status: 'succes',
    results: doc.length,
    data: {
      data: doc,
    },
  });
})