import Link from "next/link";
import Image from "@/components/Image";
import { formatRating } from "@/common/utils/StringUtils";
import { formatTodayBusinessHours, isBusinessOpen } from "@/common/utils/DateUtils";

import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from "@mui/material/IconButton";

interface ShopCardProps {
  data: Shop;
  onClick?: () => void;
  onHover?: () => void;
  href?: string;
  openNewTab?: boolean;
  isFavorite?: boolean;
  handleFavorite?: (e: React.MouseEvent<HTMLButtonElement>, id: string) => void;
}

export default function ShopCard({ data, onClick, onHover, href, openNewTab, isFavorite, handleFavorite }: ShopCardProps) {
  const handleClick = () => {
    if (onClick) onClick();
  };

  const handleHover = () => {
    if (onHover) onHover();
  };

  const content = (
    <div className={`shop-card ${onClick || href ? "clickable" : ""}`} onClick={handleClick} onMouseEnter={handleHover}>
      <div className="image-wrapper">
        <Image
          className="image"
          src={data.image}
          alt={data.name}
          width={280}
          height={160}
        />
        <div className={`open-tag ${isBusinessOpen(data.businessHours) ? 'open' : 'closed'}`}>
          {isBusinessOpen(data.businessHours) ? '営業中' : '営業時間外'}
        </div>
        {handleFavorite &&
          <IconButton
            className={`favorite-icon ${isFavorite ? "active" : ""}`}
            onClick={(e) => handleFavorite(e, data.shopId)}
          >
            <FavoriteIcon />
          </IconButton>
        }
      </div>
      <div className="info-wrapper">
        <div className="info">
          <div className="name">
            {data.name}
          </div>
          <div className="rating">
            {formatRating(data.ratingAvg || 0)}
          </div>
        </div>
        <div className="info-detail-wrapper">
          <div className="details">
            <div className="location">{data.location}</div>
            <div className="description">
              {data.description || formatTodayBusinessHours(data.businessHours)}
            </div>
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