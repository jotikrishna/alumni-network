const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true
    },
    date: {
      type: String,
      required: [true, 'Event date is required']
    },
    time: {
      type: String,
      required: [true, 'Event time is required']
    },
    location: {
      type: String,
      required: [true, 'Event location is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Event description is required']
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Event', eventSchema);
