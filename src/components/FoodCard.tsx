"use client";

import { useState } from 'react';
import { currency } from '@/common/utils/StringUtils';
import Image from "@/components/Image";

import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

interface FoodCardProps {
  data: Food;
  onClick?: () => void;
  isFavorite?: boolean;
  isAdded?: boolean;
  handleFavorite?: (e: React.MouseEvent<HTMLButtonElement>, id: string) => void;
}

export default function FoodCard({ data, onClick, isFavorite, isAdded, handleFavorite }: FoodCardProps) {
  const [showAddIcon, setShowAddIcon] = useState<boolean>(false);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isAdded) {
      const imageWrapper = e.currentTarget.querySelector('.image-wrapper');
      if (imageWrapper) {
        const target = e.currentTarget;
        target.style.pointerEvents = 'none';
        setShowAddIcon(true);
        setTimeout(() => {
          setShowAddIcon(false);
          if (onClick) onClick();
          if (target) target.style.pointerEvents = 'auto';
        }, 1500);
      }
    } else {
      if (onClick) onClick();
    }
  };

  return (
    <div key={data.id} className={`food-card ${onClick ? "clickable" : ""}`} onClick={handleClick}>
      <div className="image-wrapper">
        <Image
          className="image"
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
        {showAddIcon &&
          <div className="added-icon">
            <AddShoppingCartIcon fontSize="inherit" />
          </div>
        }
        {handleFavorite &&
          <IconButton
            className={`favorite-icon ${isFavorite ? "active" : ""}`}
            onClick={(e) => handleFavorite(e, data.id)}
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