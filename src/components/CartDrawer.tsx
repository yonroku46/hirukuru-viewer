"use client";

import React, { useState } from 'react';
import { currency } from '@/common/utils/StringUtils';
import { Global } from '@emotion/react';
import FoodCard from '@/components/FoodCard';

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

interface CartDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  window?: () => Window;
}

const DrawerBox = styled('div')(({ theme }) => ({
  backgroundColor: '#fff'
}));

const Puller = styled('div')(({ theme }) => ({
  width: 50,
  height: 6,
  backgroundColor: grey[500],
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 25px)'
}));

export default function CartDrawer(props: CartDrawerProps) {
  const { open, setOpen, window } = props;

  const [cartItems, setCartItems] = useState<Food[]>([
    { id: '1', shopId: 'fuk001', name: '唐揚げ弁当', price: 1000, discountPrice: 950, rating: 4.3, quantity: 1, image: 'https://i.pinimg.com/736x/f2/67/df/f267dfdd2b0cb8eac4b5e9674aa49e97.jpg' },
    { id: '2', shopId: 'fuk001', name: '特製のり弁', price: 500, discountPrice: 450, rating: 4.5, quantity: 1, image: 'https://i.pinimg.com/736x/d2/bb/52/d2bb52d3639b77f024c8b5a584949644.jpg' },
    { id: '8', shopId: 'fuk001', name: '8番弁当', price: 1000, rating: 4.3, quantity: 1, image: 'https://i.pinimg.com/236x/fa/bb/37/fabb376e55255930c8f6cc3e4680d239.jpg' },
    { id: '9', shopId: 'fuk001', name: '9番弁当', price: 1000, rating: 4.3, quantity: 1, image: 'https://i.pinimg.com/236x/95/a0/44/95a0447698ce226edc3eab2d4bc8d23e.jpg' },
  ]);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const handleDeleteItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handleDeleteAll = () => {
    setCartItems([]);
  };

  const handleQuantity = (e: React.MouseEvent<HTMLButtonElement>, id: string, quantity: number) => {
    if (quantity === 0) {
      setCartItems(cartItems.filter(item => item.id !== id));
    } else {
      setCartItems(cartItems.map(item => item.id === id ? { ...item, quantity } : item));
    }
  };

  const container = window !== undefined ? () => window().document.body : undefined;

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
        container={container}
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
          <Typography className="container swipeable-drawer" sx={{ p: 2 }}>
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
