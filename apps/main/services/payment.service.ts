import { clientApi } from "../lib/clientApi";

export const paymentService = {
  async initPayment(items: { id: string; quantity: number }[], addressDetails: { customerName: string; customerPhone: string; customerAddress: string; city: string }) {
    return clientApi.post("payment/init", { items, ...addressDetails });
  },

  async verifyTransaction(transactionId: string) {
    return clientApi.get(`payment/verify/${transactionId}`);
  },

  async getAddressByPhone(phone: string) {
    return clientApi.get(`payment/address/${phone}`);
  },
};
