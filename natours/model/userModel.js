import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User must have a namw'],
  },
  email: {
    type: String,
    required: [true, 'User must have an email address'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    minlength: 8,
    // to check if passwordconfirm is equal to password
    // using self custom validator
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'password does not match with confirm password',
    },
  },
  passwordChangeAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active:{
    type: Boolean,
    default: true,
    select: false
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// how to encrept or hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  // hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // delete the ocnfirm password so it wont be saved in the database
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangeAt = Date.now() - 1000;
  next();
});

// how to hide users who are not active
userSchema.pre(/^find/, async function (next) {
  this.find({active:{$ne:false}});
  next()
})

// check if password match when login
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// check if user change password after registration
userSchema.methods.changePasswordAfterRegistration = function (JWTTimestamp) {
  if (this.passwordChangeAt) {
    const changedTimestamp = parseInt(
      this.passwordChangeAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  // flase means not change
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    console.log({resetToken}, this.passwordResetToken)
  
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

   
  return resetToken;
};



// check if password match when login
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};



const User = mongoose.model('User', userSchema);

export default User;
