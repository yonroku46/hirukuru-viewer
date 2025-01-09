import Link from 'next/link';

import Button from '@mui/material/Button';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';

export default function NotFound() {
  return (
    <div className="container not-found">
      <div className="not-found-content">
        <SentimentVeryDissatisfiedIcon className="icon" />
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
        <Button variant="contained">
          ホームに戻る
        </Button>
      </Link>
    </div>
  );
};