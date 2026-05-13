const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const customerSchema = new mongoose.Schema(
  {
    'firstName': {
      type: String,
      required: true,
    },
    'lastName': {
      type: String,
      required: true,
    },
    'email': {
      type: String,
      required: true,
      unique: true,
    },
    'password': {
      type: String,
      required: true,
      minlength: 6,
    },
    'address': {
      type: String,
      required: true,
    },
    'phoneNumber': {
      type: String,
      required: true,
    },
  },
  { collection: 'customers', timestamps: true },
);

customerSchema.methods.getJWTToken = function () {
  const customer = this;
  const token = jwt.sign({ id: customer._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};

customerSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

customerSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    // what does this if do is it checking if the password field has been modified or not. If the password field has not been modified, it means that the password is already hashed and we don't need to hash it again. In that case, we can simply call next() to move on to the next middleware or save operation without rehashing the password. This is an optimization to avoid unnecessary hashing when the password hasn't changed.
    // isModified is a method provided by Mongoose that checks if a specific field has been modified since the last save. In this case, we are checking if the 'password' field has been modified. If it hasn't been modified, we can skip the hashing process and just call next() to proceed with saving the document without rehashing the password.
    return;
  }
  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
});

const Customer = mongoose.model('customer', customerSchema);

module.exports = Customer;
