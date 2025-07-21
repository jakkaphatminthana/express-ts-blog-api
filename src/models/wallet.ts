import { model, Schema, Types, Document } from 'mongoose';

export interface IWallet {
  userId: Types.ObjectId;
  amount: number;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type WalletDocument = Document & IWallet;

const walletSchema = new Schema<IWallet>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Assuming there is a User model to
      required: [true, 'User ID is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
    },
    note: {
      type: String,
      required: false,
    },
  },
  { timestamps: true },
);

export default model<IWallet>('Wallet', walletSchema);
