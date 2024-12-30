"use client";

import { useEffect, useState } from 'react';
import { currency } from '@/common/utils/StringUtils';
import Image from "@/components/Image";

import FavoriteIcon from '@mui/icons-material/Favorite';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

interface FoodCardProps {
  data: Food;
  onClick?: () => void;
  isFavorite?: boolean;
  handleFavorite?: (e: React.MouseEvent<HTMLButtonElement>, id: string) => void;
  handleDeleteItem?: (id: string) => void;
  handleQuantity?: (e: React.MouseEvent<HTMLButtonElement>, id: string, quantity: number) => void;
}

export default function FoodCard({ data, onClick, isFavorite, handleFavorite, handleDeleteItem, handleQuantity }: FoodCardProps) {
  return (
    <div key={data.id} className={`food-card ${onClick ? "clickable" : ""}`} onClick={onClick}>
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
        {handleFavorite &&
          <IconButton
            className={`favorite-icon ${isFavorite ? "active" : ""}`}
            onClick={(e) => handleFavorite(e, data.id)}
          >
            <FavoriteIcon />
          </IconButton>
        }
        {handleDeleteItem &&
          <IconButton
            className="delete-icon"
            onClick={(e) => handleDeleteItem(data.id)}
          >
            <DeleteIcon />
          </IconButton>
        }
        {handleQuantity &&
          <div className="quantity-wrapper">
            <IconButton
              className="minus-icon"
              onClick={(e) => handleQuantity(e, data.id, data.quantity ? data.quantity - 1 : 0)}
            >
              <RemoveIcon />
            </IconButton>
            <div className="quantity">
              {currency(data.quantity || 0)}
            </div>
            <IconButton
              className="plus-icon"
              onClick={(e) => handleQuantity(e, data.id, data.quantity ? data.quantity + 1 : 1)}
            >
              <AddIcon />
            </IconButton>
          </div>
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