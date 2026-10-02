const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required']
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true
    },
    graduationYear: {
      type: Number,
      required: [true, 'Graduation year is required']
    },
    company: {
      type: String,
      default: '',
      trim: true
    },
    jobTitle: {
      type: String,
      default: '',
      trim: true
    },
    location: {
      type: String,
      default: '',
      trim: true
    },
    bio: {
      type: String,
      default: ''
    },
    skills: {
      type: [String],
      default: []
    },
    profileImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);
