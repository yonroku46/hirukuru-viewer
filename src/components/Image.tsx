import { useState, useEffect } from 'react';
import NextImage, { ImageProps } from 'next/image';
import { config } from '@/config';

const fallbackImg = '/assets/img/no-image.png';

export function imgRender(src: string): string {
  if (!src || src === 'null' || src === 'undefined') {
    return fallbackImg;
  }
  return src.startsWith('/assets') || src.startsWith('data') || src.startsWith('https')
    ? src
    : `https://${config.aws.s3Prefix}/${src}`;
}

interface ImgProps extends Omit<ImageProps, 'src' | 'alt'> {
  src: string | null | undefined;
  alt: string | null | undefined;
  width?: number | `${number}`;
  height?: number | `${number}`;
  fallbackSrc?: string;
}

export default function Image({ src, alt, width, height, fallbackSrc = fallbackImg, ...props }: ImgProps) {
  const [imgSrc, setImgSrc] = useState<string>(fallbackSrc);
  const [imgAlt, setImgAlt] = useState<string>('unknown');

  useEffect(() => {
    // 値がnull, undefined, または 'null', 'undefined' の場合はデフォルト画像を使用
    const resolvedSrc = imgRender(src ?? fallbackSrc);
    setImgSrc(resolvedSrc);
    setImgAlt(alt ?? 'unknown');
  }, [src, alt, fallbackSrc]);

  const handleError = () => {
    setImgSrc(fallbackSrc);
    setImgAlt('unknown');
  };

  return (
    <NextImage
      src={imgSrc}
      alt={imgAlt}
      width={width}
      height={height}
      onError={handleError}
      {...props}
    />
  );
};