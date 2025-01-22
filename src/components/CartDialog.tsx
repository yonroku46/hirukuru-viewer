"use client";

import React, { forwardRef, Fragment, useEffect, useState } from "react";
import { AppDispatch, useAppDispatch, useAppSelector } from "@/store";
import { setCartState } from "@/store/slice/cartSlice";
import Image from "@/components/Image";
import { useMediaQuery } from "react-responsive";
import { currency, optionsToString } from "@/common/utils/StringUtils";
import QuantityButton from "@/components/button/QuantityButton";
import MiniButton from "@/components/button/MiniButton";
import { enqueueSnackbar } from "notistack";
import { Payments, payments } from '@square/web-sdk';

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
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import IconButton from "@mui/material/IconButton";
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AppleIcon from '@mui/icons-material/Apple';
import GoogleIcon from '@mui/icons-material/Google';
import CurrencyYenIcon from '@mui/icons-material/CurrencyYen';
import NoticeBoard from "./NoticeBoard";
import Link from "next/link";

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

// オプションチェック
const optionsEqual = (opts1: FoodOption[], opts2: FoodOption[]) => {
  if (opts1.length !== opts2.length) return false;
  return opts1.every((opt1) => opts2.some((opt2) => opt1.optionId === opt2.optionId));
};

export const addToCart = (dispatch: AppDispatch, item: Food, quantity?: number, options?: FoodOption[]) => {
  const existingCartItems = JSON.parse(localStorage.getItem(cartKey) || "[]");

  // 新しいアイテムは追加、既存のアイテムは数量を増やす
  let newCartItems;
  const itemIndex = existingCartItems.findIndex((existingItem: Food) =>
    existingItem.foodId === item.foodId && optionsEqual(existingItem.options || [], options || [])
  );
  if (itemIndex === -1) {
    newCartItems = [...existingCartItems, {...item, quantity: quantity || 1, options: options || [] }];
  } else {
    existingCartItems[itemIndex].quantity += quantity || 1;
    newCartItems = [...existingCartItems];
  }

  // ローカルストレージとストアに反映
  localStorage.setItem(cartKey, JSON.stringify(newCartItems));
  dispatch(setCartState({ cartItems: newCartItems }));
  enqueueSnackbar("カートに追加しました", { variant: 'success' });
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
  const [paymentStep, setPaymentStep] = useState<'ready' | 'payment' | 'done'>('ready');
  const [payType, setPayType] = useState<PayType['type']>('card');
  const [squarePayments, setSquarePayments] = useState<Payments | null>(null);

  const stepTitle = {
    ready: '注文リスト',
    payment: 'お支払い',
    done: '注文完了'
  };
  const stepStatus = {
    ready: `${currency(cartItems.length)}項目`,
    payment: 'お支払い方法を選択',
  };
  const paymentMethods = [
    { type: 'cash', icon: <CurrencyYenIcon fontSize="large" />, label: '現金（現地払い）', content:
      <NoticeBoard simple title="注意事項" contents={["受け取りの際には必ず「会員証のご提示」をお願い致します。", "注文後、お客様の事情によるキャンセルにつきましては「ペナルティ」が発生しますのでご注意ください。"]} />
    },
    { type: 'card', icon: <CreditCardIcon fontSize="large" />, label: 'カード決済', content:
      <div id="card-container" />
    },
    { type: 'apple', icon: <AppleIcon fontSize="large" />, label: 'Apple Pay' },
    { type: 'google', icon: <GoogleIcon fontSize="large" />, label: 'Google Pay'  },
  ];

  useEffect(() => {
    const loadSquarePayments = async () => {
      const paymentsInstance = await payments(
        process.env.NEXT_PUBLIC_SQUARE_SANDBOX_ID || '',
        process.env.NEXT_PUBLIC_SQUARE_SANDBOX_LOCATION_ID || ''
      );
      if (!paymentsInstance) {
        console.error('Square Payments SDK failed to load');
        return;
      }
      await paymentsInstance.setLocale('ja-JP');
      setSquarePayments(paymentsInstance);
    }
    loadSquarePayments();
    return () => {
      setSquarePayments(null);
    }
  }, []);

  useEffect(() => {
    if (open) {
      setDeleteMode(false);
      setPaymentStep('ready');
      setPayType('card');
    }
  }, [open]);

  useEffect(() => {
    setCartItems(cartState.cartItems || []);
  }, [cartState]);

  const handleOpen = (open: boolean) => () => {
    setOpen(open);
  };

  const handleDeleteItem = (id: string, options: FoodOption[]) => {
    const updatedCartItems = cartItems.filter((item) =>
      !(item.foodId === id && optionsEqual(item.options || [], options))
    );
    localStorage.setItem(cartKey, JSON.stringify(updatedCartItems));
    dispatch(setCartState({ cartItems: updatedCartItems }));
  };

  const handleQuantity = (id: string, quantity: number, options: FoodOption[]) => {
    const updatedCartItems = quantity === 0
      ? cartItems.filter(item => !(item.foodId === id && optionsEqual(item.options || [], options)))
      : cartItems.map(item =>
          item.foodId === id && optionsEqual(item.options || [], options)
            ? { ...item, quantity }
            : item
        );

    localStorage.setItem(cartKey, JSON.stringify(updatedCartItems));
    dispatch(setCartState({ cartItems: updatedCartItems }));
  };

  const handlePayment = async () => {
    if (cartItems.length > 0 && totalPrice > 0) {
      if (!squarePayments) {
        enqueueSnackbar('Squareがロードされていません', { variant: 'error' });
        return;
      }
      if (paymentStep === 'ready') {
        // お支払い情報選択
        try {
          setPaymentStep('payment');
          const card = await squarePayments.card();
          const cardContainer = document.querySelector('#card-container');
          if (cardContainer && cardContainer.children.length === 0) {
            await card.attach('#card-container');
          }
        } catch (error) {
          console.error('Payment request error:', error);
        }
      } else if (paymentStep === 'payment') {
        // 決済実行
        try {
          const card = await squarePayments.card();
          await handleTokenizeCard(card);
          setPaymentStep('done');
        } catch (error) {
          console.error('Tokenization error:', error);
        }
      } else if (paymentStep === 'done') {
        // 注文完了
        setOpen(false);
      }
    } else {
      enqueueSnackbar('不正なリクエストです', { variant: 'error' });
    }
  };

  const handleTokenizeCard = async (card: any) => {
    try {
      const paymentResult = await card.tokenize();
      if (paymentResult.status === 'OK') {
        console.log('Payment success:', paymentResult.token);
      } else {
        console.error('Payment failed:', paymentResult.errors);
      }
    } catch (error) {
      console.error('Tokenization error:', error);
    }
  };

  const totalPrice = cartItems.reduce((total, item) => {
    const itemPrice = (item.discountPrice || item.price) * (item?.quantity || 1);
    const optionsPrice = item.options?.reduce((optTotal, option) => optTotal + (option.price || 0) * (item?.quantity || 1), 0) || 0;
    return total + itemPrice + optionsPrice;
  }, 0);

  return (
    <Fragment>
      <MiniButton
        icon={
          <Badge
            color="secondary"
            variant="standard"
            badgeContent={cartItems.length}
            max={9}
            sx={{
              '& .MuiBadge-badge': {
                backgroundColor: 'var(--badge-color)',
              }
            }}
          >
            <ShoppingCartOutlinedIcon className="cart-icon" sx={{ color: cartItems.length > 0 ? 'var(--badge-color)' : 'unset' }} />
          </Badge>
        }
        onClick={handleOpen(true)}
      />
      <Dialog
        className="cart-dialog"
        fullScreen={isSp}
        TransitionComponent={Transition}
        keepMounted
        open={open}
        onClose={handleOpen(false)}
      >
        <DialogTitle className="cart-title">
          {paymentStep === 'ready' &&
            <DeleteSweepOutlinedIcon
              className={`delete-icon ${cartItems.length > 0 ? "active" : ""}`}
              onClick={() => setDeleteMode(!deleteMode)}
            />
          }
          {paymentStep !== 'ready' &&
            <ArrowBackRoundedIcon
              className={`back-icon active ${paymentStep === 'done' ? "disabled" : ""}`}
              onClick={() => setPaymentStep('ready')}
            />
          }
          {stepTitle[paymentStep]}
          <CloseIcon
            className="close-icon"
            onClick={handleOpen(false)}
          />
        </DialogTitle>
        <DialogContent className="content">
          {paymentStep !== 'done' &&
            <div className="cart-status">
              {stepStatus[paymentStep]}
            </div>
          }
          {/* Ready Step */}
          <div className={`content-step ready ${paymentStep === 'ready' ? "active" : ""}`}>
            {cartItems.length > 0 ?
              cartItems.map((item, index) =>
                <div key={index} className="cart-item">
                  <div className="cart-item-wrapper">
                    <div className="cart-item-img">
                      <Image className={deleteMode ? "delete-mode" : ""} src={item.image} alt={item.name} width={60} height={60} />
                      {deleteMode &&
                        <IconButton className="delete-icon" onClick={() => handleDeleteItem(item.foodId, item.options || [])}>
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
                        <div className="options">
                          {optionsToString(item.options || [])}
                        </div>
                      </div>
                    </div>
                    <QuantityButton
                      disabled={deleteMode}
                      quantity={item.quantity || 0}
                      handleMinus={() => handleQuantity(item.foodId, item.quantity ? item.quantity - 1 : 0, item.options || [])}
                      handlePlus={() => handleQuantity(item.foodId, item.quantity ? item.quantity + 1 : 1, item.options || [])}
                    />
                  </div>
                  <div className="cart-item-total-price">
                    {currency(
                      ((item.discountPrice ? item.discountPrice : item.price) * (item.quantity || 1)) +
                      (item.options?.reduce((optTotal, option) => optTotal + (option.price || 0) * (item.quantity || 1), 0) || 0),
                      "円"
                    )}
                  </div>
                </div>
              ) : (
                <div className="content empty">
                  <ProductionQuantityLimitsIcon fontSize="large" />
                  <p>まだ何も入っていません</p>
                </div>
              )
            }
          </div>
          {/* Payment Step */}
          <div className={`content-step payment ${paymentStep === 'payment' ? "active" : ""} ${paymentStep === 'done' ? "completed" : ""}`}>
            {paymentMethods.map((method, index) => (
              <div
                key={index}
                className={`payment-method-wrapper ${payType === method.type ? "active" : ""}`}
                onClick={() => setPayType(method.type as PayType['type'])}
              >
                <div className="payment-method">
                  {method.icon}
                  {method.label}
                </div>
                {method.content &&
                  <div className="payment-method-content">
                    {method.content}
                  </div>
                }
              </div>
            ))}
          </div>
          {/* Done Step */}
          <div className={`content-step done ${paymentStep === 'done' ? "active" : ""}`}>
            <div className="done-wrapper">
              <Image
                src="/assets/img/done.png"
                alt="注文完了"
                width={280}
                height={280}
              />
              <h2 className="done-title">注文完了</h2>
              <p className="done-description">
                {`ご注文ありがとうございます！\n注文状況は下記の注文番号をクリックするとご確認できます。`}
              </p>
              <Link href="/my/order" className="done-order-number" onClick={handleOpen(false)}>
                注文番号：{Math.floor(Math.random() * 100000)}
              </Link>
            </div>
          </div>
        </DialogContent>
        <DialogActions className="cart-actions">
          <Button
            variant="contained"
            className={`order-btn ${!deleteMode && cartItems.length !== 0 ? "active" : ""}`}
            onClick={handlePayment}
          >
            {paymentStep === 'ready' &&
              <div>
                合計
                <span className="total-price">{currency(totalPrice, "円")}</span>
                注文する
              </div>
            }
            {paymentStep === 'payment' &&
              <div>
                {payType === 'cash' ?
                  <div>
                    注文確定
                  </div>
                  :
                  <div>
                    <span className="total-price">{currency(totalPrice, "円")}</span>
                    お支払い
                  </div>
                }
              </div>
            }
            {paymentStep === 'done' &&
              <div>
                閉じる
              </div>
            }
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
