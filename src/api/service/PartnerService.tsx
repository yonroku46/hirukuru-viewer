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

  return {
    getOrderedList
  };

}