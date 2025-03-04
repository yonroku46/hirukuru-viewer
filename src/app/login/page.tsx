"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { enqueueSnackbar } from "notistack";
import { useAppSelector, useAppDispatch } from "@/store";
import { googleLogin, lineLogin } from "@/common/utils/OAuth2Utils";
import Loading from "@/app/loading";
import AuthService from "@/api/service/AuthService";
import OAuth2Service from "@/api/service/OAuth2Service";

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);
  const authService = AuthService(dispatch);
  const oAuth2Service = OAuth2Service(dispatch);

  let popupWindow: Window | null = null;
  let checkPopupInterval: NodeJS.Timeout | null = null;
  const [userId, setUserId] = useState<string>("");
  const [userPw, setUserPw] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loginSuccess, setLoginSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (authState.hasLogin) {
      router.replace(sessionStorage.getItem('redirect') || '/');
    }
  }, [authState, router]);

  useEffect(() => {
    const receiveHandler = (event: MessageEvent) => {
      if (event.data.error) {
        console.error(event.data.error)
        return;
      }
      const platform = event.data.platform;
      const code = event.data.code;
      if (platform === 'google' && code) {
        setLoginSuccess(true);
        clearInterval(checkPopupInterval as NodeJS.Timeout);
        oAuth2Service.googleAccess(code).then(data => {
          if (data) {
            const redirect = sessionStorage.getItem('redirect') || '/';
            router.replace(redirect);
          } else {
            enqueueSnackbar("ログインに失敗しました", { variant: "error" });
          }
          setLoading(false);
        });
      }
      if (platform === 'line' && code) {
        setLoginSuccess(true);
        clearInterval(checkPopupInterval as NodeJS.Timeout);
        oAuth2Service.lineAccess(code).then(data => {
          if (data) {
            const redirect = sessionStorage.getItem('redirect') || '/';
            router.replace(redirect);
          } else {
            enqueueSnackbar("ログインに失敗しました", { variant: "error" });
          }
          setLoading(false);
        });
      }
    };
    // メッセージ受信イベントリスナーを追加
    window.addEventListener('message', receiveHandler);
    return () => {
      window.removeEventListener('message', receiveHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openLoginModal = (url: string) => {
    // 画面の中央にポップアップを配置
    const width = 500;
    const height = 600;
    const screenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
    const screenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;
    const screenWidth = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth;
    const screenHeight = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight;
    const left = screenWidth / 2 - width / 2 + screenLeft;
    const top = screenHeight / 2 - height / 2 + screenTop;
    popupWindow = window.open(url, '_blank', `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`);
    // ポップアップウィンドウのステータスチェック
    if (popupWindow) {
      setLoading(true);
      checkPopupInterval = setInterval(() => {
        if (popupWindow?.closed) {
          clearInterval(checkPopupInterval as NodeJS.Timeout);
          if (!loginSuccess) {
            setLoading(false);
          }
        }
      }, 500);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userId === "" || userPw === "") {
      enqueueSnackbar("ログイン情報を入力してください", { variant: "warning" });
      return;
    }
    const result = await authService.login(userId, userPw);
    if (result) {
      router.replace(sessionStorage.getItem('redirect') || '/');
    } else {
      enqueueSnackbar("ログインに失敗しました", { variant: "error" });
    }
  }

  const handleSocialLogin = (platform: string) => {
    if (platform === 'GOOGLE') {
      openLoginModal(googleLogin());
    } else if (platform === 'LINE') {
      openLoginModal(lineLogin());
    }
  }

  if (loading) {
    return <Loading circular />
  }

  return (
    <article>
      <div className="container login">
        <div className="login-container">
          <div className="header-wrapper">
            <div className="service-logo-wrapper">
              <Image
                className="service-logo"
                src="/assets/icon/app/icon-192x192.png"
                alt="Hirukuru"
                width={100}
                height={100}
              />
              <h1 className="service-title">
                ヒルクル
              </h1>
            </div>
          </div>
          <div className="body-wrapper">
            <form className="format" onSubmit={handleEmailLogin}>
              <input
                required
                name="email"
                type="email"
                placeholder="ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
              <div className="password-input-group">
                <input
                  required
                  name="password"
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Password"
                  value={userPw}
                  onChange={(e) => setUserPw(e.target.value)}
                />
                <button type="button" className="password-visible-btn" onClick={() => setPasswordVisible(!passwordVisible)}>
                  {passwordVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </button>
              </div>
              <button type="submit" className="email-btn email">
                <Image src="/assets/icon/mail.svg" className="icon" alt="Email" width={24} height={24} />
                <div className="text">
                  <span>E-Mailでログイン</span>
                </div>
              </button>
            </form>
            <div className="action-btn-group">
              <button className="social-btn google" onClick={() => handleSocialLogin('GOOGLE')}>
                <Image src="/assets/icon/google.svg" className="icon" alt="Google" width={24} height={24} />
                <div className="text">
                  <span>Googleでログイン</span>
                </div>
              </button>
              <button className="social-btn line" onClick={() => handleSocialLogin('LINE')}>
                <Image src="/assets/icon/line.svg" className="icon" alt="LINE" width={24} height={24} />
                <div className="text">
                  <span>LINEでログイン</span>
                </div>
              </button>
            </div>
            <div className="caution">
              アカウントをお持ちでない方は
              <Link href="/signup">
                こちら
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
