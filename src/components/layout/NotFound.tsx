import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="container not-found">
      <div className="not-found-content">
        <Image
          src="/assets/icon/not-found.png"
          alt="not-found"
          width={70}
          height={70}
        />
        <div className="not-found-title">
          <h1>404</h1>
          <div>Page not found</div>
        </div>
      </div>
      <div className="not-found-text">
        <p>
          ページが移動または削除されたか、<br />
          URLの入力間違いの可能性がございます。
        </p>
      </div>
      <Link href="/">
        <button className="not-found-btn">
          ホームに戻る
        </button>
      </Link>
    </div>
  );
};