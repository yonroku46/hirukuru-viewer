"use client";

import { Fragment, useEffect, useState } from 'react';
import { useMediaQuery } from "react-responsive";
import { useAppDispatch } from "@/store";
import { currency } from '@/common/utils/StringUtils';
import Image from "@/components/Image";
import { addToCart } from "@/components/CartDialog";
import QuantityButton from '@/components/button/QuantityButton';

import FavoriteIcon from '@mui/icons-material/Favorite';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import CloseIcon from "@mui/icons-material/Close";
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

interface FoodInfoDialogProps {
  data: Food | null;
  open: boolean;
  setOpen: (open: boolean) => void;
  isFavorite?: boolean;
  handleFavorite?: (e: React.MouseEvent<HTMLButtonElement>, id: string) => void;
}

export default function FoodInfoDialog({ data, open, setOpen, isFavorite, handleFavorite }: FoodInfoDialogProps) {
  const dispatch = useAppDispatch();
  const isSp = useMediaQuery({ query: "(max-width: 1179px)" });

  const [showAddIcon, setShowAddIcon] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (open) {
      setQuantity(1);
      setShowAddIcon(false);
    }
  }, [open]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const addBtn = e.currentTarget;
    if (addBtn && data) {
      const target = e.currentTarget as HTMLButtonElement;
      target.style.pointerEvents = 'none';
      addToCart(dispatch, data, quantity);
      setShowAddIcon(true);
      setTimeout(() => {
        setOpen(false);
        if (target) target.style.pointerEvents = 'auto';
      }, 500);
    }
  };

  if (!data) {
    return null;
  }

  return (
    <Fragment>
      <Dialog
        className="food-info-dialog"
        fullScreen={isSp}
        open={open}
        onClose={() => setOpen(false)}
      >
        <DialogTitle className="title-wrapper">
          <div className="title">
            <ManageSearchOutlinedIcon />
            商品詳細
          </div>
          <CloseIcon className="close-icon" onClick={() => setOpen(false)} />
        </DialogTitle>
        <DialogContent className="content">
          <div className="image-wrapper">
            <Image
              src={data.image}
              alt={data.name}
              width={280}
              height={160}
            />
            {handleFavorite &&
              <IconButton
                className={`favorite-icon ${isFavorite ? "active" : ""}`}
                onClick={(e) => handleFavorite(e, data.foodId)}
              >
                <FavoriteIcon fontSize="large" />
              </IconButton>
            }
          </div>
          <div className="food-detail-wrapper">
            <div className="food-name-rating">
              <div className="food-name">
                {data.name}
                {data.discountPrice && data.discountPrice < data.price &&
                  <div className="sale-tag">
                    {`${Math.round((1 - data.discountPrice / data.price) * 100)}% OFF`}
                  </div>
                }
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
            {data.description &&
              <p className="description">
                {data.description}
              </p>
            }
            {data.ingredients &&
              <div className="info">
                <label>材料・構成</label>
                <div className="ingredient-list">
                  {data.ingredients.map((ingredient, index) => (
                    <span key={index} className="ingredient">
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
            }
            <div className="actions">
              <QuantityButton
                notDelete
                quantity={quantity}
                handleMinus={() => {
                  if (quantity > 1) {
                    setQuantity(quantity - 1);
                  }
                }}
                handlePlus={() => {
                  setQuantity(quantity + 1);
                }}
              />
              <Button variant="contained" className="add-btn" onClick={handleClick}>
                {showAddIcon &&
                  <div className="added-icon">
                    <AddShoppingCartIcon fontSize="inherit" />
                  </div>
                }
                カートに入れる
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};