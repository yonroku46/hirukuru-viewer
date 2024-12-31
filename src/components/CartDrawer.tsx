"use client";

import React, { useEffect, useState } from 'react';
import { currency } from '@/common/utils/StringUtils';
import { Global } from '@emotion/react';
import FoodCard from '@/components/FoodCard';
import { AppDispatch, useAppDispatch, useAppSelector } from '@/store';
import { setCartState } from '@/store/slice/cartSlice';

import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import CssBaseline from '@mui/material/CssBaseline';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import DeleteSweepOutlinedIcon from '@mui/icons-material/DeleteSweepOutlined';

const drawerBleeding = 46;
const userId = '001';
const cartKey = `cart_${userId}`;

const DrawerBox = styled('div')(() => ({
  backgroundColor: '#fff'
}));

const Puller = styled('div')(() => ({
  width: 50,
  height: 6,
  backgroundColor: grey[500],
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 25px)'
}));

export const addToCart = (dispatch: AppDispatch, item: Food) => {
  const existingCartItems = JSON.parse(localStorage.getItem(cartKey) || '[]');
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

interface CartDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function CartDrawer({ open, setOpen }: CartDrawerProps) {
  const dispatch = useAppDispatch();
  const cartState = useAppSelector((state) => state.cart);
  const [cartItems, setCartItems] = useState<Food[]>([]);

  useEffect(() => {
    setCartItems(cartState.cartItems || []);
  }, [cartState]);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const handleDeleteItem = (id: string) => {
    const updatedCartItems = cartItems.filter((item) => item.id !== id);
    localStorage.setItem(cartKey, JSON.stringify(updatedCartItems));
    dispatch(setCartState({ cartItems: updatedCartItems }));
  };

  const handleDeleteAll = () => {
    localStorage.setItem(cartKey, JSON.stringify([]));
    dispatch(setCartState({ cartItems: [] }));
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

  const totalPrice = cartItems.reduce((total, item) => total + (item.discountPrice || item.price), 0);
  const totalPointBack = Math.round(totalPrice * 0.05);

  return (
    <div>
      <CssBaseline />
      <Global
        styles={{
          '.Swipeable-MuiDrawer-root > .MuiPaper-root': {
            height: `calc(50% - ${drawerBleeding}px)`,
            overflow: open ? 'visible' : 'hidden',
          },
          '.PrivateSwipeArea-root': {
            pointerEvents: open ? 'auto' : 'none',
          }
        }}
      />
      <div className="cart-btn" onClick={toggleDrawer(true)}>
        <Badge color="secondary" badgeContent={cartItems.length} max={9} variant={"standard"}>
          <ShoppingCartOutlinedIcon className="cart-icon" />
        </Badge>
      </div>
      <SwipeableDrawer
        className="Swipeable-MuiDrawer-root"
        container={window !== undefined ? () => window.document.body : undefined}
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <DrawerBox
          sx={{
            position: 'absolute',
            top: -drawerBleeding,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            visibility: 'visible',
            right: 0,
            left: 0,
          }}
        >
          <Puller />
          <Typography className="container swipeable-drawer" sx={{ p: 2, m: "auto" }}>
            <div className="drawer-title">
              {`注文リスト (${currency(cartItems.length)})`}
              <Button className={`delete-btn ${cartItems.length > 0 ? 'active' : ''}`} onClick={handleDeleteAll}>
                <DeleteSweepOutlinedIcon className="delete-icon" />
                {`全て削除`}
              </Button>
            </div>
          </Typography>
        </DrawerBox>
        <DrawerBox className="container swipeable-drawer" sx={{ px: 2, pb: 2, height: '100%', overflow: 'auto' }}>
          <div className="cart-items">
            {cartItems.map((item) =>
              <FoodCard
                key={item.id}
                data={item}
                handleDeleteItem={handleDeleteItem}
                handleQuantity={handleQuantity}
              />
            )}
          </div>
          <div className="total-price-container">
            <div className="point-back">
              {`予想ポイントバック ${currency(totalPointBack, "P")}`}
            </div>
            <Button className="order-btn" variant="contained" color="primary">
              合計
              <span className="total-price">{currency(totalPrice, "円")}</span>
              注文する
              <KeyboardDoubleArrowRightIcon className="arrow-icon" />
            </Button>
          </div>
        </DrawerBox>
      </SwipeableDrawer>
    </div>
  );
}
