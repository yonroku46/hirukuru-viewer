"use client";

import { Fragment, useEffect, useState } from 'react';
import { useMediaQuery } from "react-responsive";
import { useAppDispatch } from "@/store";
import { currency, optionsToString } from '@/common/utils/StringUtils';
import Image from "@/components/Image";
import { addToCart } from "@/components/CartDialog";
import QuantityButton from '@/components/button/QuantityButton';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import CloseIcon from "@mui/icons-material/Close";
import Button from '@mui/material/Button';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';

interface FoodInfoDialogProps {
  data: Food | null;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function FoodInfoDialog({ data, open, setOpen }: FoodInfoDialogProps) {
  const dispatch = useAppDispatch();
  const isSp = useMediaQuery({ query: "(max-width: 1179px)" });

  const [quantity, setQuantity] = useState<number>(1);
  const [options, setOptions] = useState<FoodOption[]>([]);

  useEffect(() => {
    if (open) {
      setQuantity(1);
      setOptions([]);
    }
  }, [open]);

  const handleClick = () => {
    if (data) {
      if (addToCart(dispatch, data, quantity, options)) {
        setOpen(false);
      }
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
              src={data.thumbnailImg}
              alt={data.name}
              width={280}
              height={160}
            />
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
                            <Checkbox
                              onChange={(e) => {
                                setOptions(e.target.checked ?
                                  [...options, option] : options.filter(o => o.optionId !== option.optionId)
                                );
                              }}
                            />}
                          label={optionsToString(option)}
                        />
                      ))}
                    </FormGroup>
                    :
                    <RadioGroup
                      onChange={(e) => {
                        const selectedOption = data.options?.find(option => option.optionId === e.target.value);
                        if (selectedOption) {
                          setOptions([selectedOption]);
                        }
                      }}
                    >
                      {data.options.map((option) => (
                        <FormControlLabel
                          key={option.optionId}
                          value={option.optionId}
                          control={<Radio />}
                          label={optionsToString(option)}
                        />
                      ))}
                    </RadioGroup>
                  }
                </div>
              </div>
            }
            <div className="actions">
              {data.stock !== undefined && data.stock < 10 && data.stock > 0 ? (
                <div className="stock-alert">
                  <span className="count">
                    {`残り${data.stock}個`}
                  </span>
                  まもなく完売
                </div>
              ) : data.stock === 0 && (
                <div className="stock-alert">
                  在庫切れ
                </div>
              )}
              <div className="actions-group">
                <QuantityButton
                  disabled={data.stock !== undefined && data.stock === 0}
                  notDelete
                  quantity={quantity}
                  handleMinus={() => {
                    if (quantity > 1) {
                      setQuantity(quantity - 1);
                    }
                  }}
                  handlePlus={() => {
                    if (data.stock === undefined || quantity < data.stock) {
                      setQuantity(quantity + 1);
                    }
                  }}
                />
                <Button
                  variant="contained"
                  className="add-btn"
                  onClick={handleClick}
                  disabled={data.stock !== undefined && data.stock === 0}
                >
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