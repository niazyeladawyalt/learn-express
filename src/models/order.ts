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
    },
  },
  { timestamps: true }, // ✅ Enables createdAt and updatedAt fields
);

export default mongoose.model('Order', orderSchema);
