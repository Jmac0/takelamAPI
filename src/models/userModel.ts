import { add } from 'date-fns';
import mongoose from 'mongoose';
const crypto = require('crypto');
const validator = require('validator');
const bcrypt = require('bcrypt');

interface UserInterface extends Document {
  email: { tag: string; unique: boolean };
  password: string;
  passwordConfirm: string;
  validator: () => boolean;
  correctPassword: (password: string, candidatePassword: string) => boolean;
  passwordChangedAt: Date;
  passwordChangedAfter: (JWTTimestamp: number) => boolean;
  passwordResetToken: string | undefined;
  passwordResetExpires: Date | undefined;
  createResetToken: () => string;
}

const userSchema = new mongoose.Schema<UserInterface>({
  email: {
    type: String,
    required: [true, 'Please enter an email address'],
    lowercase: true,
    validate: [validator.isEmail, 'Please enter a valid email address'],
  },

  password: {
    type: String,
    required: [true, 'Please provide a password'],
    // stop password being sent
    select: false,
  },

  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    // compare passwords
    validate: {
      // only runs on create & save
      validator: function (el: string): boolean {
        return el === this.password;
      },
      message: 'Passwords do not match',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,

  passwordResetExpires: Date,
});

userSchema.pre('save', async function (next) {

  // check if the password is different form the stored password
  if (!this.isModified('password')) return next();
  // Salt and hash password
  this.password = await bcrypt.hash(this.password, 10);
  // delete password confirm
  this.passwordConfirm = undefined;

  next();
});


userSchema.pre('save', async function (next) {
  // check if the password is different form the stored password
  if (!this.isModified('password') || this.isNew) return next();
  // Add time to db + 2 second to allow for latency in saving so the JWT is not created  in the past
  this.passwordChangedAt = add(new Date(), {
    years: 0,
    months: 0,
    weeks: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: -2,
  })

  next();
});







// instance method, compare hashed passwords
userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// custom validator for unique email value
/*
userSchema.plugin(uniqueValidator, {
  message: 'The email: {VALUE} is already in use',
});
*/

userSchema.methods.passwordChangedAfter = async function (
  JWTTimestamp: number
) {
  if (this.passwordChangedAt as Date) {
    const changedTimestamp: number = parseInt(
      // change time format with / 1000 and .getTime
      String(this.passwordChangedAt.getTime() / 1000),
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  // Default,  false means password has not been changed //

  return false;
};

userSchema.methods.createResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
// set token in db
 this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
 // set expires time in db
  this.passwordResetExpires = add(new Date(), {
    years: 0,
    months: 0,
    weeks: 0,
    days: 0,
    hours: 1,
    minutes: 10,
    seconds: 0,
  })


 return resetToken;
};

const User = mongoose.model<UserInterface>('User', userSchema);
export default User;
