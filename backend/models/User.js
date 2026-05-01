import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  credits: {
    type: Number,
    default: 5,
    min: 0,
  },
  plan: {
    type: String,
    enum: ['free', 'pro', 'enterprise'],
    default: 'free',
  },
  totalProcessed: {
    type: Number,
    default: 0,
  },
  history: [{
    originalUrl: String,
    resultUrl: String,
    createdAt: { type: Date, default: Date.now },
  }],
  stripeCustomerId: {
    type: String,
    sparse: true,
  },
  subscriptionId: {
    type: String,
    sparse: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
  },
});

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ stripeCustomerId: 1 });

// Update lastLogin on each login
userSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

export default mongoose.model('User', userSchema);