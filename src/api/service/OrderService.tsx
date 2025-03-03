import ApiInstance from '@/api';
import ApiRoutes from '@/api/module/ApiRoutes';

export default function OrderService() {

  async function createOrder(data: OrderState): Promise<ActionRes | undefined> {
    try {
      const response: ApiResponse = await ApiInstance.post(ApiRoutes.ORDER_INFO, data);
      if (response && !response.hasErrors) {
        return response.responseData;
      }
    } catch (error) {
      console.error(error);
    }
  }

  return {
    createOrder,
  };
}