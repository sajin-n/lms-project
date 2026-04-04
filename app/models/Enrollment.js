import mongoose from 'mongoose';

const EnrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true,
    },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    grade: {
      type: String,
      enum: ['N/A', 'A', 'B', 'C', 'D', 'F'],
      default: 'N/A',
    },
    status: {
      type: String,
      enum: ['enrolled', 'completed'],
      default: 'enrolled',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

EnrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

export default mongoose.models.Enrollment || mongoose.model('Enrollment', EnrollmentSchema);
