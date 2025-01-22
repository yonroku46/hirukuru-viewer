"use client";

import Image from "next/image";

export default function LoginPage() {
  return (
    <article>
      <div className="container login">
        <div className="login-header">
          <h1 className="title">
            Hirukuru
          </h1>
          <p className="description">
            ランチをラクに、余裕のある時間へ
          </p>
        </div>
        <div className="login-btn-group">
          <button className="social-btn google">
            <Image src="/assets/icon/google.svg" className="icon" alt="Google" width={24} height={24} />
            <div className="text">
              <span>Googleでログイン</span>
            </div>
          </button>
          <button className="social-btn line">
            <Image src="/assets/icon/line.svg" className="icon" alt="LINE" width={24} height={24} />
            <div className="text">
              <span>LINEでログイン</span>
            </div>
          </button>
        </div>
        <p className="caution">
          ログイン情報は自動で保存されます
        </p>
      </div>
    </article>
  );
}
