import { clientApi } from "../lib/clientApi";

export const orderService = {
  async getMyOrders() {
    return clientApi.get("orders/my-orders");
  },
};
