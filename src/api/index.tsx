import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { lastValueFrom, BehaviorSubject, throwError, from } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import AuthService from '@/api/service/AuthService';
import { store } from '@/store';
import { enqueueSnackbar } from "notistack";

export const tokenPrefix = 'Bearer';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  retry?: boolean;
}

const ApiInstance = axios.create()
axios.defaults.baseURL = `${process.env.NEXT_PUBLIC_BASE_URL}:${process.env.NEXT_PUBLIC_VIEW_PORT}`;
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

const dispatch = store.dispatch;
const authService = AuthService(dispatch);
// 現在のトークン更新リクエストが進行中かどうかを追跡する用
let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

// リクエストインターセプターの設定
ApiInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // パス設定
    if (typeof window !== 'undefined') {
      const currentUrl = new URL(window.location.href);
      config.headers['Mapping-Path'] = `${currentUrl.pathname}`;
    }
    // トークン設定
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      config.headers['Authorization'] = `${tokenPrefix} ${currentUser.token}`;
      config.headers['RefreshToken'] = `${tokenPrefix} ${currentUser.refreshToken}`;
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// レスポンスインターセプターの設定
ApiInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError) => {
    switch (error.response?.status) {
      case 401:
        return handle401Error(error);
      case 403:
        handle403Error();
        break;
      case 409:
        handle409Error();
        break;
      default:
        handleDefaultError(error);
        break;
    }
    return Promise.reject(error);
  }
)

function openAlert(contents: string, href?: string) {
  enqueueSnackbar(contents, { variant: 'error' });
  if (href) {
    window.location.href = href;
  }
}

async function handle401Error(error: AxiosError): Promise<any> {
  const originalRequest = error.config as CustomAxiosRequestConfig;
  // 個別のリクエストでは繰り返し処理されないように防止
  if (!originalRequest) {
    return Promise.reject(error);
  }

  if (!originalRequest.retry) {
    originalRequest.retry = true;
    if (!isRefreshing) {
      isRefreshing = true;
      refreshTokenSubject.next(null);

      try {
        const responseData = await lastValueFrom(from(authService.refreshToken()).pipe(take(1)));
        isRefreshing = false;
        if (responseData) {
          localStorage.setItem('currentUser', JSON.stringify(responseData));
          refreshTokenSubject.next(responseData.token);
          originalRequest.headers['Authorization'] = `${tokenPrefix} ${responseData.token}`;
          originalRequest.headers['RefreshToken'] = `${tokenPrefix} ${responseData.refreshToken}`;
          return axios(originalRequest).then((response) => {
            return response.data;
          });
        } else {
          authService.logout(true);
          // Session expired
          openAlert("セッションが期限切れになりました。再度ログインしてください。", '/login');
          return throwError(() => new Error('Session expired'));
        }
      } catch (error: any) {
        handleDefaultError(error);
        return throwError(() => error);
      }
    } else {
      return lastValueFrom(
        refreshTokenSubject.pipe(
          filter(token => token !== null),
          take(1),
          switchMap((token) => {
            originalRequest.headers['Authorization'] = `${tokenPrefix} ${token}`;
            return axios(originalRequest).then((response) => {
              return response.data;
            });
          }),
          catchError((error: any) => {
            handleDefaultError(error);
            return throwError(() => error);
          })
        )
      );
    }
  }
  return Promise.reject(error);
}

function handle403Error(): void {
  // Unauthorized access
  openAlert("アクセス権限がありません", '/');
}

function handle409Error(): void {
  // Error conflict
  authService.logout(true);
  openAlert('エラーが発生しました。再度ログインしてください', '/login');
}

function handleDefaultError(error: AxiosError): void {
  const status = error.response?.status;
  openAlert("予期しないエラーが発生しました。\n問題が解決しない場合は、サービス管理者にお問い合わせください。");
  console.error(`${status} Error response`, error.response);
}

export default ApiInstance;