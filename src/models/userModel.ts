import mongoose from 'mongoose';
const validator = require('validator');
const bcrypt = require('bcrypt');
const uniqueValidator = require('mongoose-unique-validator');
interface UserInterface extends Document {
  name: string;
  email: { tag: string; unique: boolean };
  password: string;
  passwordConfirm: string;
  validator: () => boolean;
  correctPassword: (password: string, candidatePassword: string) => boolean;
  passwordChangedAt: Date;
  passwordChangedAfter: (JWTTimestamp: number) => boolean;
}

const userSchema = new mongoose.Schema<UserInterface>({
  name: {
    type: String,
    required: [true, 'Please provide a username '],
  },
  email: {
    type: String,
    required: [true, 'Please enter an email address'],
    unique: true,
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

// instance method, compare hashed passwords
userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
// custom validator for unique email value
userSchema.plugin(uniqueValidator, {
  message: 'The email: {VALUE} is already in use',
});


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

const User = mongoose.model<UserInterface>('User', userSchema);
export default User;
