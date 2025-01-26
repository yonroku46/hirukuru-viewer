"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { enqueueSnackbar } from "notistack";

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function LoginPage() {
  const [userId, setUserId] = useState<string>("");
  const [userPw, setUserPw] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const handleEmailLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userId === "" || userPw === "") {
      enqueueSnackbar("ログイン情報を入力してください", {
        variant: "warning",
      });
      return;
    }
  }

  const handleSocialLogin = () => {
    console.log("social login");
  }

  return (
    <article>
      <div className="container login">
        <div className="login-container">
          <div className="header-wrapper">
            <h1 className="title">
              Hirukuru
            </h1>
            <p className="description">
              ランチをラクに、余裕のある時間へ
            </p>
          </div>
          <div className="body-wrapper">
            <form className="format" onSubmit={handleEmailLogin}>
              <input
                required
                type="email"
                placeholder="Email ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
              <div className="password-input-group">
                <input
                  required
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
              <button className="social-btn google" onClick={handleSocialLogin}>
                <Image src="/assets/icon/google.svg" className="icon" alt="Google" width={24} height={24} />
                <div className="text">
                  <span>Googleでログイン</span>
                </div>
              </button>
              <button className="social-btn line" onClick={handleSocialLogin}>
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
