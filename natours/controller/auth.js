import { promisify } from 'util';
// crypto importation
import crypto from 'crypto';
// // user authentication
// import bcrypt from 'bcryptjs';
// jwt importation
import jwt from 'jsonwebtoken';

// user model importation
import User from '../model/userModel.js';

// importing app error
import AppError from '../utils/appError.js';

// catchAsync error importation
import { catchAsync } from '../utils/catchAsync.js';

// import nodemailer function
import sendEmail from '../utils/email.js';

// using id of user to create token for authentication
// all imported from env file but it not a must for it to be in the env file it might be inside another file
// the jwt secret token to be imported should be at least 32 characters long
// JWT_EXPIRES_IN means the time for the token to expire
const signToken = (id) => {
  // {id:id} or {id}
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

export const signup = catchAsync(async (req, res, next) => {
  const newUser = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  };
  const user = await User.create(newUser);

  createSendToken(user, 201, res);

  // using id of user to create token for authentication
  // all imported from env file but it not a must for it to be in the env file it might be inside another file
  // the jwt secret token to be imported should be at least 32 characters long
  // JWT_EXPIRES_IN means the time for the token to expire
  // const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
  //   expiresIn: process.env.JWT_EXPIRES_IN,
  // });
  // or
  // const token = signToken(user._id);
  // res.status(201).json({
  //   status: 'success',
  //   token,
  //   message: 'account created successfully',
  //   data: {
  //     user,
  //   },
  // });
});

export const login = catchAsync(async (req, res, next) => {
  // const email = req.body.email;
  // const password = req.body.password;
  //  or
  const { email, password } = req.body;
  // check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide an email and password', 400));
  }
  // check if user exist check if password is correct
  // i can use either {email:email} or {email} any of the two will work
  // we use .select("+password") because the password is set to be hidden in the model and this will set the hidden to true here
  const user = await User.findOne({ email }).select('+password');
  // correctPassword is from user model
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('incorrecct email or password', 401));
  }
  createSendToken(user, 200, res);
  // check if everthing is ok and send jwt token to client
  // const token = signToken(user._id);
  // res.status(200).json({
  //   status: 'success',
  //   message: 'login successfully',
  //   token,
  // });
});

//route to protect tour route
export const protect = catchAsync(async (req, res, next) => {
  let token;
  // checking if user have token and if the token is valid
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // check if token exist
  if (!token) {
    return next(
      new AppError('You are not login! please login to get access', 401)
    );
  }

  // token verification
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // check if user exist

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user beloging to this token does no longer exist', 401)
    );
  }

  // to check if users still exist and if the login details are still intact
  // e.g the case of password reset
  if (currentUser.changePasswordAfterRegistration(decoded.iat)) {
    return next(
      new AppError('User recently change password, pls login again', 400)
    );
  }

  // grant user access to protected route
  req.user = currentUser;
  next();
});

// route to restrict users to some certain action on tours
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles["admin", "lead-guild"].role = "user"
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You are not permitted to perform this action', 403)
      );
    }
    next();
  };
};

// route to forgotPassword
export const forgotPassword = catchAsync(async (req, res, next) => {
  // check if email exist
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new AppError('There is no user with the email address provided', 404)
    );
  }

  // generate random token
  // createPasswordResetToken is decleare on the user model
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;
  const message = `For got your password? Submit a patch request with your new password and password confirm to: ${resetURL}.\nIf you didn't forget your password please ignore this email!`;
  try {
    await sendEmail({
      email: req.body.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });
    res.status(200).json({
      status: 'sucess',
      message: 'token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('there is error sending mail! try again later'),
      500
    );
  }
});

// route to reset password after forgotten password
export const resetPassword = catchAsync(async (req, res, next) => {
  // get user based on token
  const hashToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // set new password if token has not expired
  if (!user) {
    return next(new AppError('Your Token is invalid or expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  // update changepassword property for user
  // login user
  // const token = signToken(user._id);
  // res.status(200).json({
  //   status: 'success',
  //   token,
  //   message: 'password changed successfully',
  // });
  createSendToken(user, 200, res);
});

export const updatePassword = catchAsync(async (req, res, next) => {
  // get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // check if current password to be entered is correct
  // correctPassword is a function declare in the user model
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong', 401));
  }
  // if correct password, update the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // log user in and send jwt
  createSendToken(user, 201, res);
});
