import { match } from 'assert';
import fs from 'fs';

//reading our API data
// const tourData = JSON.parse(
//   fs.readFileSync('./dev-data/data/tours-simple.json')
// );

// tour model importation
import Tour from '../model/tourModel.js';

// creating middleware to check for id
export const checkId = (req, res, next, val) => {
  console.log(`Tour id is :${val}`);
  if (req.params.id * 1 > tourData.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid id',
    });
  }
  next();
};

//controller function for Tour crud operation
export const getAllTour = async (req, res) => {
  try {
    // beggining of search query
    // how to use search query to find data in the database and this can work without the queryObj stated above
    // two different ways of search query
    // 1
    // initailizing what to be used fo query search and 3rd parties operation not to be included
    const queryObj = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);

    // Advance query search i.e adding >= && <= in mogoose and mongodb
    // first thing is to convert the object to string
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)


    // continuation of step 1 instead of JSON.parse(queryString) req.query or the specific area to search condition can be put in the find() method e.g{duration: 5, difficulty: easy}
    const query = Tour.find(JSON.parse(queryString));
    const getTour = await query;

    // step 2
    // const getTour = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');
    // end of search query

    // const getTour = await Tour.find();
    res.status(200).send({
      status: 'succes',
      results: getTour.length,
      data: {
        tour: getTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'unable to list all tour in the database',
    });
  }
};

export const CreateTour = async (req, res) => {
  try {
    const createTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: createTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'invalid data sent!',
    });
  }
};

export const getTourById = async (req, res) => {
  const id = req.params.id;
  try {
    const singleTour = await Tour.findById(id);
    res.status(200).json({
      status: 'success',
      message: ` tour ${id} find successfully`,
      data: {
        tour: singleTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: `unable to get tour with the id of ${id}`,
    });
  }
};

export const patchTour = async (req, res) => {
  const id = req.params.id;
  try {
    const updateTour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      message: `tour with id ${id} updated successfully`,
      data: {
        tour: updateTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: `unable to update tour with id ${id}`,
    });
  }
};

export const deleteTour = async (req, res) => {
  const id = req.params.id;
  try {
    await Tour.findByIdAndRemove(id);
    res.status(204).json({
      status: 'success',
      message: `tour with id ${id} deleted successfully`,
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: `tour with the id ${id} deleted successfully`,
    });
  }
};
