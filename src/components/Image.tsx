import { useState, useEffect } from 'react';
import NextImage, { ImageProps } from 'next/image';

const fallbackImg = '/assets/img/no-image.png';

export function imgRender(src: string): string {
  if (!src || src === 'null' || src === 'undefined') {
    return fallbackImg;
  }
  if (src.startsWith('/assets') || src.startsWith('data') || src.startsWith('https')) {
    return src;
  } else {
    return `https://${process.env.NEXT_PUBLIC_S3_PREFIX}/${src}`;
  }
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
    // Use default image if value is null, undefined, or string 'null','undefined'
    if (!src || src === 'null' || src === 'undefined') {
      setImgSrc(fallbackSrc);
    } else {
      setImgSrc(imgRender(src));
    }

    if (!alt || alt === 'alt' || src === 'undefined') {
      setImgAlt('unknown');
    } else {
      setImgAlt(alt);
    }
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