"use client";

import { useRouter } from 'next/navigation';

import Button from '@mui/material/Button';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';

export default function NotFound() {
  const router = useRouter();

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
      <Button variant="contained" sx={{ mt: '1rem' }} onClick={() => router.replace('/')}>
        ホームに戻る
      </Button>
    </div>
  );
};