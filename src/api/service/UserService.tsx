import ApiInstance from '@/api';
import ApiRoutes from '@/api/module/ApiRoutes';

export default function UserService() {

  async function userInfo(): Promise<UserState | undefined> {
    try {
      const response: ApiResponse = await ApiInstance.get(ApiRoutes.USER_INFO, {});
      if (response && !response.hasErrors) {
        return response.responseData as UserState;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function updateUserInfo(data: User): Promise<ActionRes | undefined> {
    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      const params = new FormData();
      params.append('userInfo', new Blob([JSON.stringify(data)], { type: 'application/json' }));
      if (data.profileImg) {
        params.append('imgFile', data.profileImg);
      }
      const response: ApiResponse = await ApiInstance.patch(ApiRoutes.USER_INFO, params, config);
      if (response && !response.hasErrors) {
        return response.responseData;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function signout(): Promise<ActionRes | undefined> {
    try {
      const response: ApiResponse = await ApiInstance.post(ApiRoutes.USER_SIGNOUT, {});
      if (response && !response.hasErrors) {
        return response.responseData;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function addFavorite(shopId: string): Promise<ActionRes | undefined> {
    try {
      const params = {
        shopId: shopId
      };
      const response: ApiResponse = await ApiInstance.post(ApiRoutes.USER_FAVORITE, null, { params });
      if (response && !response.hasErrors) {
        return response.responseData;
      }

    } catch (error) {
      console.error(error);
    }
  }

  async function cancelFavorite(shopId: string): Promise<ActionRes | undefined> {
    try {
      const params = {
        shopId: shopId
      };
      const response: ApiResponse = await ApiInstance.delete(ApiRoutes.USER_FAVORITE, { params });
      if (response && !response.hasErrors) {
        return response.responseData;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function orderList(): Promise<ListRes<OrderState> | undefined> {
    try {
      const response: ApiResponse = await ApiInstance.get(ApiRoutes.USER_ORDER_LIST, { });
      if (response && !response.hasErrors) {
        return response.responseData as ListRes<OrderState>;
      }
    } catch (error) {
      console.error(error);
    }
  }

  return {
    userInfo,
    updateUserInfo,
    signout,
    addFavorite,
    cancelFavorite,
    orderList
  };

}