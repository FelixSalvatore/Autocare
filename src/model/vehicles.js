const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    'make': {
      type: String,
      required: true,
    },
    'model': {
      type: String,
      required: true,
    },
    'year': {
      type: Number,
      required: true,
    },
    'ownerId': {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'customer',
      required: true,
    },
    'licensePlate': {
      type: String,
      required: true,
      unique: true,
    },
  },
  { collection: 'vehicles', timestamps: true },
);

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;
