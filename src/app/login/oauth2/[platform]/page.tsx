'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

export default function OAuth2Page({ params }: { params: { platform: string } }) {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const platform = params.platform;

  useEffect(() => {
    if (platform && code) {
      window.opener.postMessage({ platform: platform, code: code }, '*');
    } else if (error) {
      window.opener.postMessage({ error: error }, '*');
    }
    window.close();
  }, [code, error, platform]);

  return (
    <Box sx={{ position: 'absolute',  top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'var(--accent-color)' }}>
      <CircularProgress color='inherit' />
    </Box>
  );
}
