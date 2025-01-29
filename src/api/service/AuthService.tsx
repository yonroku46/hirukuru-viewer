import ApiInstance from '@/api';
import ApiRoutes from '@/api/module/ApiRoutes';
import { dateNow } from '@/common/utils/DateUtils';
import { AppDispatch } from '@/store';
import { setAuthState } from '@/store/slice/authSlice';

export default function AuthService(dispatch: AppDispatch) {
  async function login(userId: string, userPw: string): Promise<any> {
    const params = {
      mail: userId,
      password: userPw
    }
    const response: ApiResponse = await ApiInstance.post(ApiRoutes.LOGIN, params);
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
  }

  async function logout(isSendReq: boolean): Promise<any> {
    storageClear();
    if (isSendReq) {
      try {
        const response: ApiResponse = await ApiInstance.post(ApiRoutes.LOGOUT);
        if (response && !response.hasErrors) {
          return true;
        }
      } catch (err) {
        console.error(err);
        return false;
      }
    }
  }

  async function verifyToken(): Promise<any> {
    try {
      const response: ApiResponse = await ApiInstance.get(ApiRoutes.VERIFY_TOKEN);
      if (response && !response.hasErrors) {
        return response.responseData;
      }
    } catch (error) {
      console.error('Error verify token:', error);
    }
  }

  async function refreshToken(): Promise<any> {
    try {
      const response: ApiResponse = await ApiInstance.get(ApiRoutes.REFRESH_TOKEN);
      if (response && !response.hasErrors) {
        return response.responseData;
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
    }
  }

  function getCurrentUser(): UserState | undefined {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      try {
        return JSON.parse(currentUser);
      } catch (error) {
        console.error('Error parsing currentUser from localStorage:', error);
        return undefined;
      }
    } else {
        return undefined;
    }
  }

  function storageClear(): void {
    localStorage.removeItem('jwtInfo');
    localStorage.removeItem('currentUser');
    dispatch(setAuthState({ hasLogin: false }));
  }

  return {
    login,
    logout,
    verifyToken,
    refreshToken,
    getCurrentUser,
  };
}