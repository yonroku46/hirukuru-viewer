import ApiInstance from '@/api';
import ApiRoutes from '@/api/module/ApiRoutes';
import { dateNow } from '@/common/utils/DateUtils';
import { AppDispatch } from '@/store';
import { setAuthState } from '@/store/slice/authSlice';

export default function OAuth2Service(dispatch: AppDispatch) {

  async function googleAccess(code: string): Promise<any> {
    const params = {
      code: code
    }
    try {
      const response: ApiResponse = await ApiInstance.get(ApiRoutes.GOOGLE_ACCESS_TOKEN, { params });
      if (response && !response.hasErrors) {
        const current = dateNow();
        const userInfo = response.responseData;
        if (userInfo) {
          const jwtInfo = {
            mail: userInfo.mail,
            iat: current.valueOf(),
            lat: current.valueOf() + (1000*60*60*24)
          }
          localStorage.setItem('jwtInfo', JSON.stringify(jwtInfo));
          localStorage.setItem('currentUser', JSON.stringify(userInfo));
          dispatch(setAuthState({ hasLogin: true }));
          return response.responseData;
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function lineAccess(code: string): Promise<any> {
    const params = {
      code: code
    }
    try {
      const response: ApiResponse = await ApiInstance.get(ApiRoutes.LINE_ACCESS_TOKEN, { params });
      if (response && !response.hasErrors) {
        const current = dateNow();
        const userInfo = response.responseData;
        if (userInfo) {
          const jwtInfo = {
            mail: userInfo.mail,
            iat: current.valueOf(),
            lat: current.valueOf() + (1000*60*60*24)
          }
          localStorage.setItem('jwtInfo', JSON.stringify(jwtInfo));
          localStorage.setItem('currentUser', JSON.stringify(userInfo));
          dispatch(setAuthState({ hasLogin: true }));
          return response.responseData;
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  return {
    googleAccess,
    lineAccess
  };
}