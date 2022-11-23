import express from 'express';
const userRouter = express.Router();

// // reviews controller importation
// import {getAllReview, createReview} from "../controller/review.js";
// importing users controllers function
import {
  getAllUsers,
  singleUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
} from '../controller/users.js';
// auth controller
import {
  signup,
  login,
  protect,
  restrictTo,
  forgotPassword,
  resetPassword,
  updatePassword,
} from '../controller/auth.js';

// signup route
userRouter.post('/signup', signup);
// login route
userRouter.post('/login', login);

// forgot password route
userRouter.post('/forgotPassword', forgotPassword);
// reset password route
userRouter.patch('/resetPassword/:token', resetPassword);

// route to update pasword
userRouter.patch('/updateMyPassword', protect, updatePassword);

// route for user to update his or her data or profle
userRouter.get('/me', protect, getMe, singleUser);

// route for user to update his or her data or profle
userRouter.patch('/updateMe', protect, updateMe);

// route for user to disactivate his or her account
userRouter.delete('/deleteMe', protect, deleteMe);

userRouter.route('/').get(getAllUsers);
userRouter.route('/:id').get(singleUser).patch(updateUser).delete(deleteUser);

export default userRouter;
