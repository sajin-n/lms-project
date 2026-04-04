import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: { type: String, required: true, minlength: 8 },
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    role: {
      type: String,
      required: true,
      enum: ['student', 'admin'],
      default: 'student',
      index: true,
    },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

UserSchema.index({ role: 1, createdAt: -1 });

export default mongoose.models.User || mongoose.model('User', UserSchema);
