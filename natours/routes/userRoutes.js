import express from 'express';
const userRouter = express.Router();

// importing users controllers function
import {
  getAllUsers,
  registerNewUser,
  singleUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe
} from '../controller/users.js';
// auth controller
import {signup, login, protect, forgotPassword, resetPassword, updatePassword} from '../controller/auth.js';

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
userRouter.patch('/updateMe', protect, updateMe);

// route for user to disactivate his or her account
userRouter.delete('/deleteMe', protect, deleteMe);




userRouter.route('/').get(getAllUsers).post(registerNewUser);
userRouter.route('/:id').get(singleUser).patch(updateUser).delete(deleteUser);

export default userRouter;
