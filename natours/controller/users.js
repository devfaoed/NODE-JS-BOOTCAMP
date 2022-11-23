// users controller

// importing app error
import AppError from '../utils/appError.js';

// user model importation
import User from '../model/userModel.js';

// import catchAsync function
import { catchAsync } from '../utils/catchAsync.js';

// importing handler factory data funtion
import { deleteOne, updateOne, createOne, getOne, getAll } from './handlerFactory.js';

// delcaring filterObj function
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// get all users
export const getAllUsers = getAll(User)
// export const getAllUsers = catchAsync(async (req, res, next) => {
//   // try {
//   const allUser = await User.find();
//   res.status(200).json({
//     status: 'success',
//     number: allUser.length,
//     message: 'all users list',
//     data: {
//       allUser,
//     },
//   });
//   //   } catch (err) {
//   //     res.status(500).json(err.message);
//   //   }
// });

// route for current user to get his own datarofile
export const getMe =  (req, res, next) => {
  req.params.id = req.user.id;
  next()
}

// route for current user to update his profile
export const updateMe = catchAsync(async (req, res, next) => {
  // create error if user post password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password upadte, please use updateMypassword',
        400
      )
    );
  }

  // we filter the data which we want the user to be able to update alone
  // filter out unwanted data files that are not allowed to be
  const filterBody = filterObj(req.body, 'name', 'email');

  // update users data
  const updateUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'status',
    data: {
      user: updateUser,
    },
  });
});

// route for current user to disactivate his acout
export const deleteMe = catchAsync(async (req, res, next) => {
  // disactivate users acct
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'status',
    data: null,
  });
});

//register a new user
// export const registerNewUser = createOne(User)

//a single user
export const singleUser = getOne(User);

// update user account
export const updateUser = updateOne(User)

// delete user
export const deleteUser = deleteOne(User);
