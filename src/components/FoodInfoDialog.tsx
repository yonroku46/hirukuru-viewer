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
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';

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
              <div className="ingredient-list">
                {data.ingredients.map((ingredient, index) => (
                  <span key={index} className="ingredient">
                    {ingredient}
                  </span>
                ))}
              </div>
            }
            {data.options && data.options.length > 0 &&
              <div className="option-wrapper">
                <p className="option-title">
                  オプション
                  {data.optionMultiple &&
                    <span className="option-multiple">
                      {`(複数選択可)`}
                    </span>
                  }
                </p>
                <div className="option-list">
                  {data.optionMultiple ?
                    <FormGroup>
                      {data.options.map((option) => (
                        <FormControlLabel
                          key={option.optionId}
                          value={option.optionId}
                          control={
                            <Checkbox size="small"
                              onChange={(e) => {
                                const optionPrice = e.target.checked ? option.price : -option.price;
                                console.log(optionPrice);
                              }}
                            />}
                          label={`
                            ${option.name} ${
                              option.price > 0
                                ? `(+${currency(option.price)}円)`
                                : option.price < 0
                                  ? `(-${currency(Math.abs(option.price))}円)`
                                  : `(無料)`
                            }
                          `}
                        />
                      ))}
                    </FormGroup>
                    :
                    <RadioGroup
                      onChange={(e) => {
                        const selectedOption = data.options?.find(option => option.optionId === e.target.value);
                        if (selectedOption) {
                          console.log(selectedOption.price);
                        }
                      }}
                    >
                      {data.options.map((option) => (
                        <FormControlLabel
                          key={option.optionId}
                          value={option.optionId}
                          control={<Radio size="small" />}
                          label={`
                            ${option.name} ${
                              option.price > 0
                                ? `(+${currency(option.price)}円)`
                                : option.price < 0
                                  ? `(-${currency(Math.abs(option.price))}円)`
                                  : `(無料)`
                            }
                          `}
                        />
                      ))}
                    </RadioGroup>
                  }
                </div>
              </div>
            }
            <div className="actions">
              {data.stock && data.stock < 10 &&
                <div className="stock-alert">
                  <span className="count">
                    {`残り${data.stock}個`}
                  </span>
                  まもなく完売
                </div>
              }
              <div className="actions-group">
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
          </div>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};