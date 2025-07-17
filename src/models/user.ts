import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    // resetToken: String,
    // resetTokenExp: Date,
    // role: {
    //   type: String,
    //   enum: ['user', 'admin', 'manager'], // extend as needed
    //   default: 'user',
    // },
    status: {
      type: String,
      default: 'I am new!',
    },
    posts: [
      {
        type: { type: Schema.Types.ObjectId, ref: 'Post' },
      },
    ],
  },
  { timestamps: true }, // ✅ Enables createdAt and updatedAt fields
);

export default mongoose.model('User', userSchema);
