"use client";

import React, { forwardRef, Fragment, useEffect, useState } from "react";
import { AppDispatch, useAppDispatch, useAppSelector } from "@/store";
import { useRouter } from "next/navigation";
import { setCartState } from "@/store/slice/cartSlice";
import { config } from "@/config";
import dayjs from "dayjs";
import Link from "next/link";
import Image from "@/components/Image";
import { useMediaQuery } from "react-responsive";
import OrderService from "@/api/service/OrderService";
import { currency, optionsToString } from "@/common/utils/StringUtils";
import { dateNow } from "@/common/utils/DateUtils";
import QuantityButton from "@/components/button/QuantityButton";
import MiniButton from "@/components/button/MiniButton";
import NoticeBoard from "@/components/NoticeBoard";
import { enqueueSnackbar } from "notistack";
import { Payments, payments } from '@square/web-sdk';
import Selector from "@/components/input/Selector";
import DateInput from "@/components/input/DateInput";
import MuiStepper from "@/components/mui/MuiStepper";

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
import ClearAllOutlinedIcon from '@mui/icons-material/ClearAllOutlined';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import IconButton from "@mui/material/IconButton";
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AppleIcon from '@mui/icons-material/Apple';
import GoogleIcon from '@mui/icons-material/Google';
import CurrencyYenIcon from '@mui/icons-material/CurrencyYen';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";

interface PickupType {
  type: 'PRE' | 'TODAY';
}
interface PickupOption {
  type: 'NOW' | 'TIME';
}
const pickupTypeOptions = [
  { label: "今から", value: 'NOW' },
  { label: "時間帯を指定", value: 'TIME' },
];
const pickupNowOptions = [
  { label: "10分以内に受け取り予定", value: "10分以内" },
  { label: "20分以内に受け取り予定", value: "20分以内" },
  { label: "30分以内に受け取り予定", value: "30分以内" },
];
const cartKey = "cart-local";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// オプションチェック
const optionsEqual = (opts1: ItemOption[], opts2: ItemOption[]) => {
  if (opts1.length !== opts2.length) return false;
  return opts1.every((opt1) => opts2.some((opt2) => opt1.optionId === opt2.optionId));
};

export const addToCart = (dispatch: AppDispatch, item: Item, quantity?: number, options?: ItemOption[]): boolean => {
  const existingCartItems = JSON.parse(localStorage.getItem(cartKey) || "[]");

  // 同じお店のものじゃない場合案内
  if (existingCartItems.length > 0 && existingCartItems[0].shopId !== item.shopId) {
    enqueueSnackbar("各店舗ごとのご注文をお願いします。", { variant: 'info' });
    return false;
  }

  // 新しいアイテムは追加、既存のアイテムは数量を増やす
  let newCartItems;
  const itemIndex = existingCartItems.findIndex((existingItem: Item) =>
    existingItem.itemId === item.itemId && optionsEqual(existingItem.options || [], options || [])
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
  return true;
}

interface CartDialogProps {
  user?: UserState;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function CartDialog({ user, open, setOpen }: CartDialogProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isSp = useMediaQuery({ query: "(max-width: 1179px)" });
  const cartState = useAppSelector((state) => state.cart);

  const orderService = OrderService();

  const [deleteMode, setDeleteMode] = useState<boolean>(false);
  const [currentDateTime, setCurrentDateTime] = useState<string>("");
  const [cartItems, setCartItems] = useState<ItemState[]>([]);

  const [allTimeOptions, setAllTimeOptions] = useState<{ label: string, value: string }[]>([]);
  const [availableTimeOptions, setAvailableTimeOptions] = useState<{ label: string, value: string }[]>([]);

  const [squarePayments, setSquarePayments] = useState<Payments | null>(null);
  const [paymentStep, setPaymentStep] = useState<CartStatus['status']>('READY');

  const [pickupType, setPickupType] = useState<PickupType['type']>('TODAY');
  const [pickupOption, setPickupOption] = useState<PickupOption['type']>('NOW');
  const [pickupDate, setPickupDate] = useState<string | undefined>(undefined);
  const [pickupTime, setPickupTime] = useState<string | undefined>(pickupNowOptions[0]?.value);

  const [payType, setPayType] = useState<PayType['type']>('CARD');

  const [usedPoint, setUsedPoint] = useState<number | undefined>(undefined);
  const [currentPoint, setCurrentPoint] = useState<number>(user?.point || 0);
  const [finalPrice, setFinalPrice] = useState<number>(0);

  const [orderId, setOrderId] = useState<string | undefined>(undefined);

  const totalPrice = cartItems.reduce((total, item) => {
    const itemPrice = (item.discountPrice || item.price) * (item?.quantity || 1);
    const optionsPrice = item.options?.reduce((optTotal, option) => optTotal + (option.price || 0) * (item?.quantity || 1), 0) || 0;
    return total + itemPrice + optionsPrice;
  }, 0);

  useEffect(() => {
    // Square Payments SDKのロード
    const loadSquarePayments = async () => {
      try {
        const paymentsInstance = await payments(
          config.square.sandboxId,
          config.square.sandboxLocationId
        );
        if (!paymentsInstance) {
          console.error('Square Payments SDK failed to load');
          return;
        }
        await paymentsInstance.setLocale('ja-JP');
        setSquarePayments(paymentsInstance);
      } catch (err) {
        console.error('Error loading Square Payments SDK:', err);
      }
    }
    loadSquarePayments();

    return () => {
      setSquarePayments(null);
    }
  }, []);

  useEffect(() => {
    // 初期化
    if (open) {
      setCurrentDateTime(dateNow().format('YYYY-MM-DD HH:mm'));
      setDeleteMode(false);
      setPaymentStep('READY');
      setPickupType('TODAY');
      setPickupOption('NOW');
      setPickupDate(undefined);
      setPickupTime(pickupNowOptions[0]?.value);
      setPayType('CARD');
      setUsedPoint(undefined);
      setCurrentPoint(user?.point || 0);
      setOrderId(undefined);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  }, [open, user]);

  useEffect(() => {
    // 現在時刻の更新
    const interval = setInterval(() => {
      if (open && paymentStep === 'FINAL') {
        const now = dateNow();
        setCurrentDateTime(now.format('YYYY-MM-DD HH:mm'));
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    }
  }, [open, paymentStep]);

  useEffect(() => {
    setFinalPrice(totalPrice - (usedPoint || 0));
  }, [totalPrice, usedPoint]);

  useEffect(() => {
    // 受け取り方法(事前予約)の初期化
    if (pickupType === 'PRE') {
      setPickupOption('NOW');
      setPickupDate(dateNow().add(1, 'day').format('YYYY-MM-DD'));
      setPickupTime(allTimeOptions[0].value);
    }
  }, [pickupType, allTimeOptions]);

  useEffect(() => {
    // 受け取り方法(当日注文)の初期化
    if (pickupType === 'TODAY') {
      setPickupDate(undefined);
      if (pickupOption === 'NOW') {
        setPickupTime(pickupNowOptions[0]?.value);
      } else if (pickupOption === 'TIME') {
        setPickupTime(availableTimeOptions[0]?.value);
      }
    }
  }, [pickupType, pickupOption, availableTimeOptions]);

  useEffect(() => {
    setCartItems(cartState.cartItems || []);
  }, [cartState]);

  useEffect(() => {
    const generateTimeOptions = () => {
      const currentHour = dateNow().hour();
      const allOptions = [];
      const availableOptions = [];
      for (let hour = 0; hour < 24; hour++) {
        const label = `${hour.toString().padStart(2, '0')}:00~${(hour + 1).toString().padStart(2, '0')}:00`;
        allOptions.push({ label, value: label });
        if (hour > currentHour) {
          availableOptions.push({ label, value: label });
        }
      }
      setAllTimeOptions(allOptions);
      setAvailableTimeOptions(availableOptions);
    };
    if (open) {
      generateTimeOptions();
    }
  }, [open]);

  const steps = ['READY', 'PICKUP', 'PAYMENT', 'FINAL', 'DONE'];
  const stepTitle = {
    READY: '注文リスト',
    PICKUP: '受け取り方法',
    PAYMENT: 'お支払い方法',
    FINAL: '内容確認',
    DONE: '注文完了'
  };
  const stepActions = {
    PICKUP: '次へ',
    PAYMENT: '次へ',
    FINAL: '注文確定',
    DONE: '閉じる'
  };
  const pickupMethods = [
    { type: 'PRE', label: '事前予約（明日以降）', content:
      <div className="pickup-option-wrapper">
        <div className="pickup-option">
          <div className="pickup-option-title">
            受け取り日時
          </div>
          <DateInput
            selectedDate={pickupDate ? dayjs(pickupDate) : null}
            minDate={dateNow().add(1, 'day')}
            onChange={(date) => {
              setPickupDate(date ? date.format('YYYY-MM-DD') : undefined);
            }}
          />
        </div>
        <div className="pickup-option">
          <div className="pickup-option-title">
            時間帯
          </div>
          {pickupType === 'PRE' &&
            <Selector
              options={allTimeOptions}
              onChange={(e) => {
                setPickupTime(e.target.value);
              }}
            />
          }
        </div>
        <NoticeBoard simple title="注意事項" contents={["お店によって予約申込の後、確定まで時間がかかる場合がございます。（最大1時間）", "注文して1時間を超えても確定されない場合は「自動でキャンセル」されますのでご了承ください。", "決済は確定したタイミングで行われます。"]} />
      </div>
    },
    { type: 'TODAY', label: '当日注文', content:
      <div className="pickup-option-wrapper">
        <RadioGroup
          onChange={(e) => {
            setPickupOption(e.target.value as PickupOption['type']);
          }}
        >
          {pickupTypeOptions.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={<Radio checked={pickupOption === option.value} />}
              label={option.label}
            />
          ))}
        </RadioGroup>
        {pickupOption === 'NOW' && (
          <div className="pickup-option">
            <Selector
              options={pickupNowOptions}
              onChange={(e) => {
                setPickupTime(e.target.value);
              }}
            />
          </div>
        )}
        {pickupOption === 'TIME' && (
          <div className="pickup-option">
            <Selector
              options={availableTimeOptions}
              onChange={(e) => {
                setPickupTime(e.target.value);
              }}
            />
          </div>
        )}
      </div>
    },
  ];
  const paymentMethods: { type: PayType['type'], icon: React.ReactNode, label: string, content?: React.ReactNode }[] = [
    { type: 'CASH', icon: <CurrencyYenIcon fontSize="large" />, label: '現金（現地払い）', content:
      <NoticeBoard simple title="お客様へのお願い" contents={["受け取りの際には必ず「会員証のご提示」をお願い致します。", "注文後、お客様の事情によるキャンセルにつきましては「ペナルティ」が発生しますのでご注意ください。"]} />
    },
    { type: 'CARD', icon: <CreditCardIcon fontSize="large" />, label: 'カード決済', content:
      <div id="card-container" />
    },
    { type: 'APPLE', icon: <AppleIcon fontSize="large" />, label: 'Apple Pay' },
    { type: 'GOOGLE', icon: <GoogleIcon fontSize="large" />, label: 'Google Pay'  },
  ];

  const getPreviousStep = (currentStep: string) => {
    const currentIndex = steps.indexOf(currentStep);
    return currentIndex > 0 ? steps[currentIndex - 1] : null;
  };

  const handleOpen = (open: boolean) => () => {
    setOpen(open);
  };

  const handleDeleteItem = (id: string, options: ItemOption[]) => {
    const updatedCartItems = cartItems.filter((item) =>
      !(item.itemId === id && optionsEqual(item.options || [], options))
    );
    localStorage.setItem(cartKey, JSON.stringify(updatedCartItems));
    dispatch(setCartState({ cartItems: updatedCartItems }));
  };

  const handleQuantity = (id: string, quantity: number, options: ItemOption[]) => {
    const updatedCartItems = quantity === 0
      ? cartItems.filter(item => !(item.itemId === id && optionsEqual(item.options || [], options)))
      : cartItems.map(item =>
          item.itemId === id && optionsEqual(item.options || [], options)
            ? { ...item, quantity }
            : item
        );

    localStorage.setItem(cartKey, JSON.stringify(updatedCartItems));
    dispatch(setCartState({ cartItems: updatedCartItems }));
  };

  const handleLogin = () => {
    setOpen(false);
    router.push('/login');
  };

  const handlePayment = async () => {
    if (cartItems.length > 0 && totalPrice > 0) {
      if (!squarePayments) {
        enqueueSnackbar('Squareがロードされていません', { variant: 'error' });
        return;
      }
      // ポイント使用時の有効性検証
      if (usedPoint && (usedPoint > currentPoint || finalPrice < 0)) {
        enqueueSnackbar('無効なポイント使用です。', { variant: 'error' });
        setUsedPoint(undefined);
        return;
      }

      if (paymentStep === 'READY') {
        // お支払い情報選択
        try {
          setPaymentStep('PICKUP');
          const card = await squarePayments.card();
          const cardContainer = document.querySelector('#card-container');
          if (cardContainer && cardContainer.children.length === 0) {
            await card.attach('#card-container');
          }
        } catch (error) {
          console.error('Payment request error:', error);
        }
      } else if (paymentStep === 'PICKUP') {
        // 受け取り方法選択
        if (pickupType) {
          setPaymentStep('PAYMENT');
        }
      } else if (paymentStep === 'PAYMENT') {
        // 決済方法選択
        if (payType) {
          setPaymentStep('FINAL');
        }
      } else if (paymentStep === 'FINAL') {
        // 内容確認、実行
        try {
          // TODO: 決済実行
          // const card = await squarePayments.card();
          // const result = await handleTokenizeCard(card);
          // if (result) {
            const order: OrderState = {
              shopId: cartState.cartItems[0]?.shopId || '',
              payType: payType,
              totalPrice: totalPrice,
              pickupTime: pickupTime,
              orderDetail: cartItems.map((item) => {
                if (item.quantity && item.quantity > 0) {
                  return {
                    itemId: item.itemId,
                    name: item.name,
                    options: item.options,
                    price: item.price,
                    quantity: item.quantity,
                    totalPrice: (item.discountPrice ? item.discountPrice : item.price) * (item.quantity),
                  }
                }
              })
            } as OrderState;
            await orderService.createOrder(order).then((res) => {
              if (res?.success) {
                setOrderId(res.id);
                setPaymentStep('DONE');
              }
            });
          // }
        } catch (error) {
          console.error('Tokenization error:', error);
        }
      } else if (paymentStep === 'DONE') {
        // 注文完了
        setOpen(false);
      }
    } else {
      enqueueSnackbar('不正なリクエストです', { variant: 'error' });
    }
  };

  // TODO: 決済実行
  // const handleTokenizeCard = async (card: any): Promise<boolean> => {
  //   try {
  //     const paymentResult = await card.tokenize();
  //     if (paymentResult.status === 'OK') {
  //       console.log('Payment success:', paymentResult.token);
  //       return true;
  //     } else {
  //       console.error('Payment failed:', paymentResult.errors);
  //       enqueueSnackbar('決済に失敗しました。', { variant: 'error' });
  //       return false;
  //     }
  //   } catch (error) {
  //     console.error('Tokenization error:', error);
  //     enqueueSnackbar('決済に失敗しました。', { variant: 'error' });
  //     return false;
  //   }
  // };

  const stepContents = [
    { type: 'READY', content:
      <>
        {cartItems.length > 0 ?
          cartItems.map((item, index) =>
            <div key={index} className="cart-item">
              <div className="cart-item-wrapper">
                <div className="cart-item-img">
                  <Image className={deleteMode ? "delete-mode" : ""} src={item.thumbnailImg} alt={item.name} width={60} height={60} />
                  {deleteMode &&
                    <IconButton className="delete-icon" onClick={() => handleDeleteItem(item.itemId, item.options || [])}>
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
                  handleMinus={() => handleQuantity(item.itemId, item.quantity ? item.quantity - 1 : 0, item.options || [])}
                  handlePlus={() => handleQuantity(item.itemId, item.quantity ? item.quantity + 1 : 1, item.options || [])}
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
      </>
    },
    { type: 'PICKUP', content:
      <>
        {pickupMethods.map((method, index) => (
          <div
            key={index}
            className={`method-wrapper ${pickupType === method.type ? "active" : ""}`}
            onClick={() => {
              setPickupType(method.type as PickupType['type'])
            }}
          >
            <div className="method-title">
              <ArrowDropDownIcon fontSize="large" />
              {method.label}
            </div>
            {method.content &&
              <div className="method-content">
                {method.content}
              </div>
            }
          </div>
        ))}
      </>
    },
    { type: 'PAYMENT', content:
      <>
        {paymentMethods.map((method, index) => (
          <div
            key={index}
            className={`method-wrapper ${payType.toLowerCase() === method.type.toLowerCase() ? "active" : ""}`}
            onClick={() => setPayType(method.type as PayType['type'])}
          >
            <div className="method-title">
              {method.icon}
              {method.label}
            </div>
            {method.content &&
              <div className="method-content">
                {method.content}
              </div>
            }
          </div>
        ))}
      </>
    },
    { type: 'FINAL', content:
      <>
        <div className="final-wrapper">
          <div className="final-title">
            {"唐揚げ壱番屋"}
            <div className="final-title-description">
              {`${cartItems[0]?.name} ${cartItems.length > 1 ? "他" + (cartItems.length - 1) + "項目" : ""}`}
            </div>
          </div>
          <div className="final-details">
            <div className="detail-info">
              <label>注文日時</label>
              {currentDateTime}
            </div>
            <div className="detail-info">
              <label>受け取り予定</label>
              {pickupType === 'PRE' &&
                `${pickupDate} ${pickupTime}`
              }
              {pickupType === 'TODAY' &&
                pickupOption === 'NOW' ?
                `${pickupTime}`
                : pickupOption === 'TIME' &&
                `本日 ${pickupTime}`
              }
            </div>
            <div className="detail-info">
              <label>区分</label>
              {pickupType === 'PRE' ? "事前予約" : "当日注文"}
            </div>
            <div className="detail-info">
              <label>お支払い</label>
              {paymentMethods.find(method => method.type === payType)?.label}
            </div>
            <div className="total-price-wrapper">
              <div className="total-price">
                <label>合計</label>
                {currency(totalPrice, "円")}
              </div>
              <div className="point">
                <label>ポイント</label>
                <div className="point-input">
                  {"-"}
                  <input type="number" placeholder="0" value={usedPoint || ''} onChange={(e) => {
                      if (Number(e.target.value) > currentPoint) {
                        setUsedPoint(currentPoint)
                      } else {
                        setUsedPoint(Number(e.target.value))
                      }
                    }}
                  />
                  {"円"}
                </div>
              </div>
              <div className="point-description">
                <button className="point-btn" onClick={() => setUsedPoint(currentPoint)}>
                  全て使用
                </button>
                <div className="current-point">
                  使用可能ポイント：{currency(currentPoint, "円")}
                </div>
              </div>
            </div>
          </div>
          <div className="final-price">
            お支払い金額
            <span className="price">
              {currency(finalPrice, "円")}
            </span>
          </div>
          <div className="final-confirm">
            {`上記の注文内容を確認し、本人は決済に同意します。`}
          </div>
        </div>
      </>
    },
    { type: 'DONE', content:
      <>
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
            注文番号：{orderId}
          </Link>
        </div>
      </>
    },
  ]

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
          {paymentStep === 'READY' ?
            !deleteMode || cartItems.length === 0 ?
              <DeleteSweepOutlinedIcon
                className={`delete-icon ${cartItems.length > 0 ? "active" : ""}`}
                onClick={() => setDeleteMode(true)}
              />
              :
              <ClearAllOutlinedIcon
                className={`list-icon ${cartItems.length > 0 ? "active" : ""}`}
                onClick={() => setDeleteMode(false)}
              />
            :
            <ArrowBackRoundedIcon
              className={`back-icon active ${paymentStep === 'DONE' ? "disabled" : ""}`}
              onClick={() => setPaymentStep(getPreviousStep(paymentStep) as CartStatus['status'] || 'READY')}
            />
          }
          {stepTitle[paymentStep]}
          <CloseIcon
            className="close-icon"
            onClick={handleOpen(false)}
          />
        </DialogTitle>
        <DialogContent className="content">
          <div className={`cart-status ${paymentStep === 'DONE' ? "hide" : ""}`}>
            {paymentStep === 'READY' && `${currency(cartItems.length)}項目`}
            {paymentStep !== 'READY' &&
              <MuiStepper
                sx={{ position: 'absolute', '&.MuiStack-root': { position: 'unset' } }}
                steps={['PICKUP', 'PAYMENT', 'FINAL']}
                activeStep={steps.indexOf(paymentStep) - 1}
              />
            }
          </div>
          {stepContents.map((content, index) => (
            <div
              key={index}
              className={`step-content ${content.type.toLowerCase()} ${paymentStep === content.type ? "active" : ""} ${steps.indexOf(paymentStep) > steps.indexOf(content.type) ? "completed" : ""}`}
            >
              {content.content}
            </div>
          ))}
        </DialogContent>
        <DialogActions className="cart-actions">
          <Button
            variant="contained"
            className={`order-btn ${!deleteMode && cartItems.length !== 0 ? "active" : ""}`}
            onClick={user ? handlePayment : handleLogin}
          >
            {user ?
              paymentStep === 'READY' ?
                <>
                  合計
                  <span className="total-price">{currency(totalPrice, "円")}</span>
                  注文する
                </>
                :
                stepActions[paymentStep]
              :
              <>
                ログインして注文する
              </>
            }
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
