const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const employeeSchema = new mongoose.Schema(
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
    'role': {
      type: String,
      enum: ['admin', 'supervisor', 'mechanic'],
      required: true,
    },
    'supervisorId': {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      ref: 'Employee', //This line defines a field called 'supervisorId' in the employee schema. It is of type ObjectId, which means it will store a reference to another document in the MongoDB database. The 'ref' option specifies that this ObjectId refers to documents in the 'Employee' collection. In simpler terms, this allows us to establish a relationship between employees and their supervisors by storing the supervisor's ID in the employee document.
    },
  },
  { collection: 'employees', timestamps: true },
);

employeeSchema.methods.getJWTToken = function () {
  const employee = this;
  const token = jwt.sign(
    { id: employee._id, role: employee.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  );
  return token;
};

employeeSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

employeeSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
