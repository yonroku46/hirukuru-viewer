"use client";

import React, { forwardRef, Fragment, useEffect, useState } from "react";
import Image from "next/image";
import { useMediaQuery } from "react-responsive";
import { currency } from "@/common/utils/StringUtils";
import { AppDispatch, useAppDispatch, useAppSelector } from "@/store";
import { setCartState } from "@/store/slice/cartSlice";

import { TransitionProps } from "@mui/material/transitions";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import Badge from "@mui/material/Badge";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DeleteSweepOutlinedIcon from "@mui/icons-material/DeleteSweepOutlined";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";

const dummyUserId = "001";
const cartKey = `cart_${dummyUserId}`;

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const addToCart = (dispatch: AppDispatch, item: Food) => {
  const existingCartItems = JSON.parse(localStorage.getItem(cartKey) || "[]");
  // 新しいアイテムは追加、既存のアイテムは数量を増やす
  const itemIndex = existingCartItems.findIndex((existingItem: Food) => existingItem.id === item.id);
  let newCartItems;
  if (itemIndex === -1) {
    newCartItems = [...existingCartItems, { ...item, quantity: 1 }];
  } else {
    existingCartItems[itemIndex].quantity += 1;
    newCartItems = [...existingCartItems];
  }
  // ローカルストレージとストアに反映
  localStorage.setItem(cartKey, JSON.stringify(newCartItems));
  dispatch(setCartState({ cartItems: newCartItems }));
  return newCartItems;
}

interface CartDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function CartDialog({ open, setOpen }: CartDialogProps) {
  const dispatch = useAppDispatch();
  const isSp = useMediaQuery({ query: "(max-width: 1179px)" });
  const cartState = useAppSelector((state) => state.cart);

  const [deleteMode, setDeleteMode] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<Food[]>([]);

  useEffect(() => {
    if (open) {
      setDeleteMode(false);
    }
  }, [open]);

  useEffect(() => {
    setCartItems(cartState.cartItems || []);
  }, [cartState]);

  const handleOpen = (open: boolean) => () => {
    setOpen(open);
  };

  const handleDeleteItem = (id: string) => {
    const updatedCartItems = cartItems.filter((item) => item.id !== id);
    localStorage.setItem(cartKey, JSON.stringify(updatedCartItems));
    dispatch(setCartState({ cartItems: updatedCartItems }));
  };

  const handleQuantity = (e: React.MouseEvent<HTMLButtonElement>, id: string, quantity: number) => {
    if (quantity === 0) {
      const updatedCartItems = cartItems.filter(item => item.id !== id);
      localStorage.setItem(cartKey, JSON.stringify(updatedCartItems));
      dispatch(setCartState({ cartItems: updatedCartItems }));
    } else {
      const updatedCartItems = cartItems.map(item => item.id === id ? { ...item, quantity } : item);
      localStorage.setItem(cartKey, JSON.stringify(updatedCartItems));
      dispatch(setCartState({ cartItems: updatedCartItems }));
    }
  };

  const totalPrice = cartItems.reduce((total, item) => total + (item.discountPrice || item.price) * (item?.quantity || 1), 0);
  const totalPointBack = Math.round(totalPrice * 0.05);

  return (
    <Fragment>
      <div className="cart-btn" onClick={handleOpen(true)}>
        <Badge color="secondary" badgeContent={cartItems.length} max={9} variant={"standard"}>
          <ShoppingCartOutlinedIcon className="cart-icon" />
        </Badge>
      </div>
      <Dialog
        className="cart-dialog"
        fullScreen={isSp}
        keepMounted
        TransitionComponent={Transition}
        open={open}
        onClose={handleOpen(false)}
      >
        <DialogTitle className="cart-title">
          <CloseIcon className="close-icon" onClick={handleOpen(false)} />
          {`注文リスト`}
          <DeleteSweepOutlinedIcon className={`delete-icon ${cartItems.length > 0 ? "active" : ""}`} onClick={() => setDeleteMode(!deleteMode)} />
        </DialogTitle>
        <DialogContent className="cart-items">
          <div className="cart-items-count">
            {`${currency(cartItems.length)}項目`}
          </div>
          {cartItems.length > 0 ?
            cartItems.map((item) =>
              <div key={item.id} className="cart-item">
                <div className="cart-item-wrapper">
                  <div className="cart-item-img">
                    <Image className={deleteMode ? "delete-mode" : ""} src={item.image} alt={item.name} width={60} height={60} />
                    {deleteMode &&
                      <IconButton className="delete-icon" onClick={() => handleDeleteItem(item.id)}>
                        <DeleteOutlineOutlinedIcon />
                      </IconButton>
                    }
                    <div className="cart-item-info">
                      <div className="cart-item-name">
                        {item.name}
                        {item.discountPrice && item.discountPrice < item.price &&
                          <div className="sale-tag">
                            {`${Math.round((1 - item.discountPrice / item.price) * 100)}% OFF`}
                          </div>
                        }
                      </div>
                      {item.discountPrice && item.discountPrice < item.price ?
                        <div className="price">
                          <p className="current-price on-sale">
                            {currency(item.discountPrice)}
                            <span className="unit">円</span>
                          </p>
                          <p className="origin-price">
                            {currency(item.price)}
                            <span className="unit">円</span>
                          </p>
                        </div>
                        :
                        <div className="price">
                          <p className="current-price">
                            {currency(item.price)}
                            <span className="unit">円</span>
                          </p>
                        </div>
                      }
                    </div>
                  </div>
                  <div className="cart-item-quantity">
                    <IconButton onClick={(e) => handleQuantity(e, item.id, item.quantity ? item.quantity - 1 : 0)}>
                      <RemoveIcon />
                    </IconButton>
                    <p className="quantity">{item.quantity}</p>
                    <IconButton onClick={(e) => handleQuantity(e, item.id, item.quantity ? item.quantity + 1 : 1)}>
                      <AddIcon />
                    </IconButton>
                  </div>
                </div>
                <div className="cart-item-total-price">
                  {currency((item.discountPrice ? item.discountPrice : item.price) * (item.quantity || 1), "円")}
                </div>
              </div>
            ) : (
              <div className="cart-items empty">
                <ProductionQuantityLimitsIcon fontSize="large" />
                <p>まだ何も入っていません</p>
              </div>
            )
          }
        </DialogContent>
        <DialogActions className="cart-actions">
          {totalPointBack > 0 &&
            <div className="point-back">
              {`予想ポイントバック ${currency(totalPointBack, "P")}`}
            </div>
          }
          <Button className={`order-btn ${totalPointBack > 0 && !deleteMode ? "active" : ""}`} variant="contained" color="primary">
            合計
            <span className="total-price">{currency(totalPrice, "円")}</span>
            注文する
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
