"use client";

import { useState } from "react";
import Link from "next/link";
import { enqueueSnackbar } from "notistack";

export default function SignupPage() {
  const [userEmail, setUserEmail] = useState<string>("");
  const [isSend, setIsSend] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userEmail === "") {
      enqueueSnackbar("メールアドレスを入力してください", {
        variant: "warning",
      });
      return;
    }
    // メール送信
    setIsSend(true);
    enqueueSnackbar("メール送信完了", {
      variant: "success",
    });
  }

  return (
    <article>
      <div className="container signup">
        <div className="signup-container">
          <div className="header-wrapper">
            <h1 className="title">
              Welcome!
            </h1>
            <p className="description" style={{ marginTop: "0.5rem", marginBottom: "-0.5rem" }}>
              {`登録まであと少し！\nメールに記載されているリンクをクリックで登録は完了します。`}
            </p>
          </div>
          <div className="body-wrapper">
            <form className="format" onSubmit={handleSubmit}>
              <input
                required
                disabled={isSend}
                type="email"
                placeholder="メールアドレスを入力"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
              <button type="submit" className={`signup-btn ${isSend ? "disabled" : ""}`}>
                {isSend ? "送信完了" : "送信"}
              </button>
            </form>
            <div className="caution">
              <Link href="/login">
                ログイン画面に戻る
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
