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

  async function getShopItem(): Promise<ListRes<Item> | undefined> {
    try {
      const response: ApiResponse = await ApiInstance.get(ApiRoutes.PARTNER_ITEM, {});
      if (response && !response.hasErrors) {
        return response.responseData as ListRes<Item>;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function upsertShopItem(items: Item[]): Promise<ActionRes | undefined> {
    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      const params = new FormData();

      const itemsToSend = items.map(item => {
        if (item.imgFile) {
          return {
            ...item,
            thumbnailImg: `imgFile_${item.itemId}`,
            imgFile: undefined
          };
        }
        return item;
      });
      params.append('items', new Blob([JSON.stringify(itemsToSend)], { type: 'application/json' }));
      items.forEach(item => {
        if (item.imgFile) {
          params.append('imgFile', item.imgFile);
        }
      });
      // const response: ApiResponse = await ApiInstance.patch(ApiRoutes.PARTNER_ITEM, items);
      const response: ApiResponse = await ApiInstance.patch(ApiRoutes.PARTNER_ITEM, params, config);
      if (response && !response.hasErrors) {
        return response.responseData;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteShopItem(ids: string[]): Promise<ActionRes | undefined> {
    try {
      const params = {
        ids: ids
      }
      const response: ApiResponse = await ApiInstance.delete(ApiRoutes.PARTNER_ITEM, { data: params });
      if (response && !response.hasErrors) {
        return response.responseData;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function getShopCategories(): Promise<ListRes<ShopCategory> | undefined> {
    try {
      const response: ApiResponse = await ApiInstance.get(ApiRoutes.PARTNER_CATEGORY, {});
      if (response && !response.hasErrors) {
        return response.responseData as ListRes<ShopCategory>;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function upsertShopCategories(categories: ShopCategory[]): Promise<ActionRes | undefined> {
    try {
      const response: ApiResponse = await ApiInstance.patch(ApiRoutes.PARTNER_CATEGORY, categories);
      if (response && !response.hasErrors) {
        return response.responseData;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteShopCategories(ids: string[]): Promise<ActionRes | undefined> {
    try {
      const params = {
        ids: ids
      }
      const response: ApiResponse = await ApiInstance.delete(ApiRoutes.PARTNER_CATEGORY, { data: params });
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
    updateOrderCancel,
    getShopItem,
    upsertShopItem,
    deleteShopItem,
    getShopCategories,
    upsertShopCategories,
    deleteShopCategories,
  };

}