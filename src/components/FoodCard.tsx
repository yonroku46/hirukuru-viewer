"use client";

import { currency } from '@/common/utils/StringUtils';
import Image from "@/components/Image";

import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';
import OutletIcon from '@mui/icons-material/Outlet';

interface FoodCardProps {
  data: Food;
  onClick?: () => void;
  soldOut?: boolean;
  isFavorite?: boolean;
  handleFavorite?: (e: React.MouseEvent<HTMLButtonElement>, id: string) => void;
}

export default function FoodCard({ data, onClick, soldOut, isFavorite, handleFavorite }: FoodCardProps) {
  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <div key={data.foodId} className={`food-card ${onClick ? "clickable" : ""}`} onClick={handleClick}>
      <div className="image-wrapper">
        <Image
          className={`image ${soldOut ? "sold-out" : ""}`}
          src={data.image}
          alt={data.name}
          width={280}
          height={160}
        />
        {data.discountPrice && data.discountPrice < data.price &&
          <div className="sale-tag">
            {`${Math.round((1 - data.discountPrice / data.price) * 100)}% OFF`}
          </div>
        }
        {soldOut &&
          <div className="sold-out-tag">
            <OutletIcon />
            在庫切れ
          </div>
        }
        {handleFavorite &&
          <IconButton
            className={`favorite-icon ${isFavorite ? "active" : ""}`}
            onClick={(e) => handleFavorite(e, data.foodId)}
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
            {data.rating || "-"}
          </div>
        </div>
        {data.discountPrice && data.discountPrice < data.price ?
          <div className="price">
            <p className="current-price on-sale">
              {currency(data.discountPrice)}
              <span className="unit">円</span>
            </p>
            <p className="origin-price">
              {currency(data.price)}
              <span className="unit">円</span>
            </p>
          </div>
          :
          <div className="price">
            <p className="current-price">
              {currency(data.price)}
              <span className="unit">円</span>
            </p>
          </div>
        }
      </div>
    </div>
  );
};