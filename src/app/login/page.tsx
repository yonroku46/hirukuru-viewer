"use client";

import Image from "next/image";

export default function LoginPage() {
  return (
    <article>
      <div className="container login">
        <div className="login-header">
          <h1>ログイン</h1>
          <p>ログイン情報はPCに自動で保存されます。</p>
        </div>
        <div className="login-button-group">
          <button className="social-button google">
            <Image src="/assets/icon/google.svg" className="icon" alt="Google" width={24} height={24} />
            <div className="text">
              <span>Googleでログイン</span>
            </div>
          </button>
          <button className="social-button line">
            <Image src="/assets/icon/line.svg" className="icon" alt="LINE" width={24} height={24} />
            <div className="text">
              <span>LINEでログイン</span>
            </div>
          </button>
        </div>
      </div>
    </article>
  );
}
