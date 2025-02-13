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

interface ItemInfoDialogProps {
  shop: Shop;
  data: Item | null;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function ItemInfoDialog({ shop, data, open, setOpen }: ItemInfoDialogProps) {
  const dispatch = useAppDispatch();
  const isSp = useMediaQuery({ query: "(max-width: 1179px)" });

  const [quantity, setQuantity] = useState<number>(1);
  const [options, setOptions] = useState<ItemOption[]>([]);

  const allergensList = [
    { allergen: '1', name: '卵', img: '/assets/img/allergen/egg.png' },
    { allergen: '2', name: '乳', img: '/assets/img/allergen/milk.png' },
    { allergen: '3', name: '小麦', img: '/assets/img/allergen/wheat.png' },
    { allergen: '4', name: 'そば', img: '/assets/img/allergen/buckwheat.png' },
    { allergen: '5', name: '落花生', img: '/assets/img/allergen/peanut.png' },
    { allergen: '6', name: 'えび', img: '/assets/img/allergen/shrimp.png' },
    { allergen: '7', name: 'かに', img: '/assets/img/allergen/crab.png' },
    { allergen: '8', name: 'くるみ', img: '/assets/img/allergen/walnut.png' },
  ]

  useEffect(() => {
    if (open) {
      setQuantity(1);
      setOptions([]);
    }
  }, [open]);

  const handleClick = () => {
    if (data) {
      if (addToCart(dispatch, shop, data, quantity, options)) {
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
        className="item-info-dialog"
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
              alt={data.itemName}
              width={280}
              height={160}
            />
          </div>
          <div className="item-detail-wrapper">
            <div className="item-name-rating">
              <div className="item-name">
                {data.itemName}
                {data.discountPrice && data.discountPrice < data.itemPrice &&
                  <div className="sale-tag">
                    {`${Math.round((1 - data.discountPrice / data.itemPrice) * 100)}% OFF`}
                  </div>
                }
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
            {data.itemDescription &&
              <p className="description">
                {data.itemDescription}
              </p>
            }
            {data.allergens &&
              <>
                <p className="allergen-title">
                  アレルギー表示
                </p>
                <div className="allergen-list">
                  {allergensList.map((allergen, index) => (
                    <span
                      key={allergen.allergen}
                      className={`allergen ${data.allergens && data.allergens[index] === '1' ? 'active' : ''}`}>
                      <Image
                        src={allergen.img}
                        alt={allergen.name}
                        width={40}
                        height={40}
                      />
                      <span className="allergen-name">
                        {allergen.name}
                      </span>
                    </span>
                  ))}
                </div>
              </>
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
                      {data.options.map((option, index) => (
                        <FormControlLabel
                          key={index}
                          value={option}
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
                      {data.options.map((option, index) => (
                        <FormControlLabel
                          key={index}
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