"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FastAverageColor } from "fast-average-color";
import { formatRating } from "@/common/utils/StringUtils";
import { formatTodayBusinessHours, isBusinessOpen } from "@/common/utils/DateUtils";

import StarRoundedIcon from '@mui/icons-material/StarRounded';

interface ShopCardProps {
  data: Shop;
  onClick?: () => void;
  href?: string;
  openNewTab?: boolean;
}

export default function ShopCard({ data, onClick, href, openNewTab }: ShopCardProps) {
  const [bgColor, setBgColor] = useState<string | null>(null);

  const handleClick = () => {
    if (onClick) onClick();
  };

  useEffect(() => {
    // CORSエラーのためにダミー画像を使用
    const dummyImage = "/assets/img/no-user.jpg";
    const fac = new FastAverageColor();
    fac.getColorAsync(dummyImage).then((result: { rgb: string }) => {
      const darkenColor = (color: string, amount: number) => {
        const [r, g, b] = color.match(/\d+/g)!.map(Number);
        return `rgb(${Math.max(r - amount, 0)}, ${Math.max(g - amount, 0)}, ${Math.max(b - amount, 0)})`;
      };
      // 背景色を暗くする
      const adjustedColor = darkenColor(result.rgb, 70);
      setBgColor(adjustedColor);
    });
  }, [data.image]);

  if (!bgColor) return null;

  const content = (
    <div className={`shop-card ${onClick || href ? "clickable" : ""}`} onClick={handleClick}>
      <div className="image-wrapper">
        <Image
          className="image"
          src={data.image}
          alt={data.name}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="info-wrapper" style={{ background: `linear-gradient(to top, ${bgColor} 60%, transparent)` }}>
        <h5 className="title">
          {data.name}
          <div className="rating">
            <StarRoundedIcon fontSize="small" style={{ color: 'var(--rating-color)' }} />
            <span>{formatRating(data.ratingAvg || 0)}</span>
          </div>
        </h5>
        <div className="info-detail-wrapper">
          <div className={`open-status ${isBusinessOpen(data.businessHours) ? 'open' : 'closed'}`}>
            {isBusinessOpen(data.businessHours) ? '営業中' : '営業時間外'}
          </div>
          <div className="details">
            <span className="location">{data.location}</span>
            <span className="time">
              {formatTodayBusinessHours(data.businessHours)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return href ? (
    <Link href={href} target={openNewTab ? "_blank" : "_self"} rel={openNewTab ? "noopener noreferrer" : undefined}>
      {content}
    </Link>
  ) : (
    content
  );
}