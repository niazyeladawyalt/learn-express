import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    items: [
      {
        productId: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
        quantity: { type: Number, required: true },
      },
    ],
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    stripeSessionId: {
      type: String,
      required: true,
      unique: true, // Optional: prevents duplicate webhook orders
    },
  },
  { timestamps: true }, // ✅ Enables createdAt and updatedAt fields
);

export default mongoose.model('Order', orderSchema);
