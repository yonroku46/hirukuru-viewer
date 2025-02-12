"use client";

import Link from 'next/link';
import { currency } from '@/common/utils/StringUtils';
import Image from "@/components/Image";

interface ItemCardProps {
  data: Item;
  onClick?: () => void;
  onHover?: () => void;
  href?: string;
  openNewTab?: boolean;
  soldOut?: boolean;
}

export default function ItemCard({ data, onClick, onHover, href, openNewTab, soldOut }: ItemCardProps) {
  const handleClick = () => {
    if (onClick) onClick();
  };

  const handleHover = () => {
    if (onHover) onHover();
  };

  const content = (
    <div key={data.itemId} className={`item-card ${onClick || href ? "clickable" : ""}`} onClick={handleClick} onMouseEnter={handleHover}>
      <div className="image-wrapper">
        <Image
          className={`image ${soldOut ? "sold-out" : ""}`}
          src={data.thumbnailImg}
          alt={data.itemName}
          width={280}
          height={160}
        />
        {data.discountPrice && data.discountPrice < data.itemPrice &&
          <div className="sale-tag">
            {`${Math.round((1 - data.discountPrice / data.itemPrice) * 100)}% OFF`}
          </div>
        }
        {soldOut &&
          <div className="sold-out-tag">
            在庫切れ
          </div>
        }
      </div>
      <div className="info-wrapper">
        <div className="info">
          <div className="name">
            {data.itemName}
          </div>
          <div className="rating">
            {data.ratingAvg || "-"}
          </div>
        </div>
        {data.discountPrice && data.discountPrice < data.itemPrice ?
          <div className="price">
            <p className="current-price on-sale">
              {currency(data.discountPrice)}
              <span className="unit">円</span>
            </p>
            <p className="origin-price">
              {currency(data.itemPrice)}
              <span className="unit">円</span>
            </p>
          </div>
          :
          <div className="price">
            <p className="current-price">
              {currency(data.itemPrice)}
              <span className="unit">円</span>
            </p>
          </div>
        }
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
};