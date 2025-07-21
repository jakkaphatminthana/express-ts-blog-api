import { WalletDocument } from '@/models/wallet';

export interface IResWalletTransaction {
  id: string;
  userId: string;
  amount: number;
  note?: string;
  createdAt: string;
}

export const walletDto = (data: WalletDocument): IResWalletTransaction => {
  return {
    id: data._id as string,
    userId: data.userId.toString(),
    amount: data.amount,
    note: data.note,
    createdAt: data.createdAt.toISOString(),
  };
};
