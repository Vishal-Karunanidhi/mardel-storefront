export type PaymentTransactionResponse = {
  transactionStatus: string;
  transactionMessage: string;
};

export type Transaction = {
  transactionId: number;
  date: string;
  action: string;
  amount: number;
};

export type ArCardData = {
  paymentTransactionResponse: PaymentTransactionResponse;
  amountDue: number;
  cardBalance: number;
  creditLimit: number;
  transactionHistory: Transaction[];
};
