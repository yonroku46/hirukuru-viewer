import ApiInstance from '@/api';
import ApiRoutes from '@/api/module/ApiRoutes';

export default function PartnerService() {

  async function getOrderedList(): Promise<ListRes<OrderState> | undefined> {
    try {
      const response: ApiResponse = await ApiInstance.get(ApiRoutes.PARTNER_ORDER_LIST, {});
      if (response && !response.hasErrors) {
        return response.responseData as ListRes<OrderState>;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function getOrderHistory(): Promise<ListRes<OrderState> | undefined> {
    try {
      const response: ApiResponse = await ApiInstance.get(ApiRoutes.PARTNER_ORDER_HISTORY, {});
      if (response && !response.hasErrors) {
        return response.responseData as ListRes<OrderState>;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function updateOrderStatus(orderId: string, status: OrderStatus['status']): Promise<ActionRes | undefined> {
    try {
      const params = new FormData();
      params.append('status', status);
      const response: ApiResponse = await ApiInstance.patch(`${ApiRoutes.PARTNER_ORDER}/${orderId}`, params);
      if (response && !response.hasErrors) {
        return response.responseData;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function updateOrderCancel(orderId: string, remarks: string): Promise<ActionRes | undefined> {
    try {
      const params = new FormData();
      params.append('remarks', remarks);
      const response: ApiResponse = await ApiInstance.patch(`${ApiRoutes.PARTNER_ORDER_CANCEL}/${orderId}`, params);
      if (response && !response.hasErrors) {
        return response.responseData;
      }
    } catch (error) {
      console.error(error);
    }
  }

  return {
    getOrderedList,
    getOrderHistory,
    updateOrderStatus,
    updateOrderCancel
  };

}