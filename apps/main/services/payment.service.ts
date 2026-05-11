import { clientApi } from "../lib/clientApi";

export const paymentService = {
  async initPayment(items: { id: string; quantity: number }[]) {
    return clientApi.post("payment/init", { items });
  },

  async verifyTransaction(transactionId: string) {
    return clientApi.get(`payment/verify/${transactionId}`);
  },
};
