"use client";

import React, { forwardRef, Fragment, useEffect, useMemo, useState } from "react";
import { AppDispatch, useAppDispatch, useAppSelector } from "@/store";
import { useRouter } from "next/navigation";
import { setCartState } from "@/store/slice/cartSlice";
import { config } from "@/config";
import dayjs, { Dayjs } from "dayjs";
import Link from "next/link";
import Image from "@/components/Image";
import { useMediaQuery } from "react-responsive";
import OrderService from "@/api/service/OrderService";
import { currency, optionsToString } from "@/common/utils/StringUtils";
import { dateNow, formatTodayBusinessHours, getNextBusinessDay, timeUntil } from "@/common/utils/DateUtils";
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
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const MINUTES_PER_OPTION = 5;
const CART_KEY = "cart-local";

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

export const addToCart = (dispatch: AppDispatch, shop: Shop, item: Item, quantity?: number, options?: ItemOption[]): boolean => {
  const existingCartItems = JSON.parse(localStorage.getItem(CART_KEY) || "[]");

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
  localStorage.setItem(CART_KEY, JSON.stringify(newCartItems));
  dispatch(setCartState({ cartItems: newCartItems, shopInfo: shop }));
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

  const [now, setNow] = useState<Dayjs>(dateNow());
  const [deleteMode, setDeleteMode] = useState<boolean>(false);
  const [shopInfo, setShopInfo] = useState<Shop | null>(null);
  const [cartItems, setCartItems] = useState<ItemState[]>([]);

  const [squarePayments, setSquarePayments] = useState<Payments | null>(null);
  const [paymentStep, setPaymentStep] = useState<CartStatus['status']>('READY');

  const [availableHourOptions, setAvailableHourOptions] = useState<{ label: string, value: string }[]>([]);
  const [minDate, setMinDate] = useState<Dayjs | undefined>(undefined);
  const [pickupDate, setPickupDate] = useState<string>(now.format('YYYY-MM-DD'));
  const [pickupPeriod, setPickupPeriod] = useState<"AM" | "PM">("AM");
  const [pickupTimeHour, setPickupTimeHour] = useState<string>("00");
  const [pickupTimeMinutes, setPickupTimeMinutes] = useState<string>("00");
  const [disableMinutesList, setDisableMinutesList] = useState<string[]>([]);

  const [payType, setPayType] = useState<PayType['type']>('CARD');

  const [usedPoint, setUsedPoint] = useState<number | undefined>(undefined);
  const [currentPoint, setCurrentPoint] = useState<number>(user?.point || 0);
  const [finalPrice, setFinalPrice] = useState<number>(0);

  const [orderId, setOrderId] = useState<string | undefined>(undefined);

  const totalPrice = cartItems.reduce((total, item) => {
    const itemPrice = (item.discountPrice || item.itemPrice) * (item?.quantity || 1);
    const optionsPrice = item.options?.reduce((optTotal, option) => optTotal + (option.optionPrice || 0) * (item?.quantity || 1), 0) || 0;
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
      const now = dateNow();
      const today = now.format('ddd').toUpperCase() as DayType['type'];
      const isOpenToday = shopInfo?.businessHours?.some((hour) => hour.dayOfWeek === today);
      const initialPickupDate = isOpenToday ? now.format('YYYY-MM-DD') : getNextBusinessDay(shopInfo?.businessHours || []).format('YYYY-MM-DD');

      setNow(now);
      setDeleteMode(false);
      setPaymentStep('READY');
      setMinDate(dayjs(initialPickupDate));
      setPickupDate(initialPickupDate);
      setPayType('CARD');
      setUsedPoint(undefined);
      setCurrentPoint(user?.point || 0);
      setOrderId(undefined);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  }, [open, user, shopInfo]);

  useEffect(() => {
    setFinalPrice(totalPrice - (usedPoint || 0));
  }, [totalPrice, usedPoint]);

  useEffect(() => {
    if (paymentStep !== 'DONE') {
      setCartItems(cartState.cartItems || []);
      setShopInfo(cartState.shopInfo || null);
    }
  }, [cartState, paymentStep]);

  useEffect(() => {
    const generateHourOptions = () => {
      // 営業時間を基に時間帯を生成
      const allOptions = [];
      const now = dateNow();
      const businessHours = shopInfo?.businessHours || [];
      const todayHours = businessHours.find((hour) => hour.dayOfWeek === now.format('ddd').toUpperCase() as DayType['type']);
      const nextBusinessDay = getNextBusinessDay(businessHours);
      const targetHours = todayHours || businessHours.find((hour) => hour.dayOfWeek === nextBusinessDay.format('ddd').toUpperCase() as DayType['type']);

      const openHour = targetHours ? parseInt(targetHours.openTime.split(':')[0], 10) : 0;
      const closeHour = targetHours ? parseInt(targetHours.closeTime.split(':')[0], 10) : 23;

      for (let hour = openHour; hour <= closeHour; hour++) {
        const formattedHour = hour.toString().padStart(2, '0');
        const label = `${formattedHour}時`;
        allOptions.push({ label, value: formattedHour });
      }

      // 現在時刻とservingTimeを考慮して選択可能な時間帯を再設定
      const isToday = pickupDate === now.format('YYYY-MM-DD');
      const servingMinutes = shopInfo?.servingMinutes || 0;
      const availableOptions = allOptions.filter((option) => {
        const hour = parseInt(option.value, 10);
        const isAM = pickupPeriod === "AM" && hour < 12;
        const isPM = pickupPeriod === "PM" && hour >= 12;
        const pickupTime = dayjs(`${pickupDate} ${option.value}:00`);

        const currentTimeWithServing = isToday ? now.add(servingMinutes, 'minute') : now;
        const isAfterCurrentTimeWithServing = pickupTime.isAfter(currentTimeWithServing) ||
          (pickupTime.isSame(currentTimeWithServing, 'hour') && currentTimeWithServing.minute() < (60 - MINUTES_PER_OPTION));

        const openTimeWithBuffer = dayjs(`${pickupDate} ${todayHours?.openTime}`).add(MINUTES_PER_OPTION, 'minute');
        const isNotOnTheHourBeforeOpen = !(pickupTime.isSame(openTimeWithBuffer.subtract(1, 'hour'), 'hour') && pickupTime.minute() === 0);

        return isAfterCurrentTimeWithServing && (isAM || isPM) &&
          (isToday ? (pickupTime.isAfter(now) || (pickupTime.isSame(now, 'hour') && now.minute() < (60 - MINUTES_PER_OPTION))) : true) &&
          isNotOnTheHourBeforeOpen;
      });

      setAvailableHourOptions(availableOptions);
      if (availableOptions.length > 0) {
        setPickupTimeHour(availableOptions[0].value);
      }
    };

    if (open) {
      generateHourOptions();
    }
  }, [open, pickupDate, pickupPeriod, shopInfo]);

  useEffect(() => {
    const generateMinute = () => {
      // 指定分単位を基に選択可能な分を生成
      const allMinutesOptions: string[] = [];
      Array.from({ length: 60 / MINUTES_PER_OPTION }, (_, i) => i * MINUTES_PER_OPTION).filter((minute) => {
        const minuteString = minute.toString().padStart(2, '0');
        allMinutesOptions.push(minuteString);
      });

      // 現在時刻とservingTimeを考慮して選択可能な分を再設定
      const now = dateNow();
      const isToday = pickupDate === now.format('YYYY-MM-DD');
      const businessHours = shopInfo?.businessHours || [];
      const todayHours = businessHours.find((hour) => hour.dayOfWeek === now.format('ddd').toUpperCase() as DayType['type']);
      const nextBusinessDay = getNextBusinessDay(businessHours);
      const targetHours = todayHours || businessHours.find((hour) => hour.dayOfWeek === nextBusinessDay.format('ddd').toUpperCase() as DayType['type']);

      if (targetHours) {
        const openTime = dayjs(`${pickupDate} ${targetHours.openTime}`);
        const closeTime = dayjs(`${pickupDate} ${targetHours.closeTime}`);
        const servingMinutes = shopInfo?.servingMinutes || 0;
        const currentTimeWithServing = isToday ? now.add(servingMinutes, 'minute') : now;

        const validMinutes = allMinutesOptions.filter((minute) => {
          const pickupTime = dayjs(`${pickupDate} ${pickupTimeHour}:${minute}`);
          const isWithinOperatingHours = (pickupTime.isAfter(openTime) || pickupTime.isSame(openTime)) &&
                                         (pickupTime.isBefore(closeTime) || pickupTime.isSame(closeTime));
          const isAfterCurrentTimeWithServing = pickupTime.isAfter(currentTimeWithServing);
          return isWithinOperatingHours && isAfterCurrentTimeWithServing;
        });
        setDisableMinutesList(allMinutesOptions.filter(minute => !validMinutes.includes(minute)));

        if (validMinutes.length > 0 && !validMinutes.includes(pickupTimeMinutes.toString())) {
          setPickupTimeMinutes(validMinutes[0]);
        } else if (validMinutes.length === 0) {
          // 選択可能な分がない場合、次の時間帯を選択
          const nextHour = (parseInt(pickupTimeHour, 10) + 1).toString().padStart(2, '0');
          if (parseInt(nextHour, 10) <= closeTime.hour()) {
            setPickupTimeHour(nextHour);
            setPickupTimeMinutes('00');
          }
        }
      }
    };

    if (open) {
      generateMinute();
    }
  }, [open, pickupDate, pickupPeriod, pickupTimeHour, pickupTimeMinutes, shopInfo]);

  useEffect(() => {
    if (open) {
      setPickupPeriod(parseInt(pickupTimeHour, 10) < 12 ? "AM" : "PM");
    }
  }, [open, pickupTimeHour]);

  const steps = ['READY', 'PICKUP', 'PAYMENT', 'FINAL', 'DONE'];
  const stepTitle = {
    READY: '注文リスト',
    PICKUP: '受け取り時間',
    PAYMENT: 'お支払い方法',
    FINAL: '内容確認',
    DONE: '注文完了'
  };
  const stepActions = {
    PICKUP: '次へ',
    PAYMENT: '次へ',
    FINAL: '上記の内容で注文',
    DONE: '閉じる'
  };

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

  const handleShopPage = () => {
    if (shopInfo) {
      setOpen(false);
      router.push(`/shop/${shopInfo.shopId}`);
    }
  };

  const handleOpen = (open: boolean) => () => {
    setOpen(open);
  };

  const handleDeleteItem = (id: string, options: ItemOption[]) => {
    const updatedCartItems = cartItems.filter((item) =>
      !(item.itemId === id && optionsEqual(item.options || [], options))
    );
    localStorage.setItem(CART_KEY, JSON.stringify(updatedCartItems));
    if (updatedCartItems.length > 0) {
      dispatch(setCartState({ cartItems: updatedCartItems, shopInfo }));
    } else {
      dispatch(setCartState({ cartItems: [], shopInfo: null }));
    }
  };

  const handleQuantity = (id: string, quantity: number, options: ItemOption[]) => {
    const updatedCartItems = quantity === 0
      ? cartItems.filter(item => !(item.itemId === id && optionsEqual(item.options || [], options)))
      : cartItems.map(item =>
          item.itemId === id && optionsEqual(item.options || [], options)
            ? { ...item, quantity }
            : item
        );

    localStorage.setItem(CART_KEY, JSON.stringify(updatedCartItems));
    if (updatedCartItems.length > 0) {
      dispatch(setCartState({ cartItems: updatedCartItems, shopInfo }));
    } else {
      dispatch(setCartState({ cartItems: [], shopInfo: null }));
    }
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
        // 受け取り時間選択
        if (pickupDate && pickupTimeHour && pickupTimeMinutes) {
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
              shopId: shopInfo?.shopId || '',
              payType: payType,
              totalPrice: totalPrice,
              pickupTime: `${pickupDate} ${pickupTimeHour}:${pickupTimeMinutes}`,
              orderDetail: cartItems.map((item: ItemState) => {
                if (item.quantity && item.quantity > 0) {
                  return {
                    itemId: item.itemId,
                    itemName: item.itemName,
                    options: item.options,
                    itemPrice: item.discountPrice ? item.discountPrice : item.itemPrice,
                    quantity: item.quantity,
                    itemTotalPrice: ((item.discountPrice ? item.discountPrice : item.itemPrice) +
                    (item.options?.reduce((optTotal, option) => optTotal + option.optionPrice, 0) || 0)) * (item.quantity),
                  }
                }
              })
            } as OrderState;
            await orderService.createOrder(order).then((res) => {
              if (res?.success) {
                setOrderId(res.id);
                setPaymentStep('DONE');
                // カートを空にする
                localStorage.setItem(CART_KEY, JSON.stringify([]));
                dispatch(setCartState({ cartItems: [] }));
              } else {
                enqueueSnackbar('注文に失敗しました。', { variant: 'error' });
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

  const minuteOptions = useMemo(() => {
    return Array.from({ length: 60 / MINUTES_PER_OPTION }, (_, i) => i * MINUTES_PER_OPTION).map((minute) => {
      const minuteString = minute.toString().padStart(2, '0');
      return (
        <button
          key={minute}
          className={`minute-option ${pickupTimeMinutes === minuteString ? "active" : ""}`}
          onClick={() => setPickupTimeMinutes(minuteString)}
          disabled={disableMinutesList.includes(minuteString)}
        >
          {`${pickupTimeHour}:${minuteString}`}
        </button>
      );
    });
  }, [pickupTimeHour, pickupTimeMinutes, disableMinutesList]);

  const stepContents = [
    { type: 'READY', content:
      <>
        {cartItems.length > 0 ?
          cartItems.map((item, index) =>
            <div key={index} className="cart-item">
              <div className="cart-item-wrapper">
                <div className="cart-item-img">
                  <Image className={deleteMode ? "delete-mode" : ""} src={item.thumbnailImg} alt={item.itemName} width={60} height={60} />
                  {deleteMode &&
                    <IconButton className="delete-icon" onClick={() => handleDeleteItem(item.itemId, item.options || [])}>
                      <DeleteOutlineOutlinedIcon />
                    </IconButton>
                  }
                  <div className="cart-item-info">
                    <div className="cart-item-name">
                      {item.itemName}
                      {item.discountPrice && item.discountPrice < item.itemPrice &&
                        <div className="sale-tag">
                          {`${Math.round((1 - item.discountPrice / item.itemPrice) * 100)}% OFF`}
                        </div>
                      }
                    </div>
                    {item.discountPrice && item.discountPrice < item.itemPrice ?
                      <div className="price">
                        <p className="current-price on-sale">
                          {currency(item.discountPrice)}
                          <span className="unit">円</span>
                        </p>
                        <p className="origin-price">
                          {currency(item.itemPrice)}
                          <span className="unit">円</span>
                        </p>
                      </div>
                      :
                      <div className="price">
                        <p className="current-price">
                          {currency(item.itemPrice)}
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
                  ((item.discountPrice ? item.discountPrice : item.itemPrice) * (item.quantity || 1)) +
                  (item.options?.reduce((optTotal, option) => optTotal + (option.optionPrice || 0) * (item.quantity || 1), 0) || 0),
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
      <div className="pickup-option-wrapper">
        <div className="pickup-option">
          <div className="pickup-option-title">
            受け取り日
          </div>
          <DateInput
            selectedDate={pickupDate ? dayjs(pickupDate) : null}
            minDate={minDate || undefined}
            filterDate={(date) => {
              if (!shopInfo || !shopInfo.businessHours) return false;
              const dayOfWeek = date.format('ddd').toUpperCase() as DayType['type'];
              return shopInfo.businessHours.some((hour) => hour.dayOfWeek === dayOfWeek);
            }}
            onChange={(date) => {
              setPickupDate(date ? date.format('YYYY-MM-DD') : now.format('YYYY-MM-DD'));
            }}
          />
        </div>
        <div className="pickup-option">
          <div className="pickup-option-title">
            希望時間
          </div>
          <div className="pickup-option-hour-wrapper">
            <button
              className={`period-option ${pickupPeriod === "AM" ? "active" : ""}`}
              onClick={() => setPickupPeriod("AM")}
              disabled={pickupDate === now.format('YYYY-MM-DD') &&
                (now.hour() >= 12 || now.add((shopInfo?.servingMinutes || 0) + 5, 'minute').hour() >= 12)
              }
            >
              午前
            </button>
            <button
              className={`period-option ${pickupPeriod === "PM" ? "active" : ""}`}
              onClick={() => setPickupPeriod("PM")}
            >
              午後
            </button>
            <Selector
              options={availableHourOptions}
              value={pickupTimeHour}
              onChange={(e) => {
                setPickupTimeHour(e.target.value);
              }}
            />
          </div>
          <div className="pickup-option-minute-wrapper">
            {minuteOptions}
          </div>
        </div>
      </div>
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
          <div className="final-details">
            <div className="detail-info">
              <label>注文商品</label>
              {`${cartItems[0]?.itemName} ${cartItems.length > 1 ? "外" + (cartItems.length - 1) + "件" : ""}`}
            </div>
            <div className="detail-info">
              <label>受け取り予定</label>
              {now.day() === dayjs(pickupDate).day() ?
                `${pickupTimeHour}:${pickupTimeMinutes}
                (約${timeUntil(dayjs(`${pickupDate} ${pickupTimeHour}:${pickupTimeMinutes}`))})`
                :
                `${pickupDate} ${pickupTimeHour}:${pickupTimeMinutes}`
              }
            </div>
            <div className="detail-info description">
              <label />
              {now.day() === dayjs(pickupDate).day() ?
                `現在時刻${now.format('HH:mm')}基準`
                :
                `明日以降の予約注文になります`
              }
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
          <Badge color="secondary" variant="standard" badgeContent={cartItems.length} max={9}
            sx={{ '& .MuiBadge-badge': { backgroundColor: 'var(--badge-color)' } }}
          >
            <ShoppingCartOutlinedIcon className="cart-icon" sx={{ color: cartItems.length > 0 ? 'var(--badge-color)' : 'unset' }} />
          </Badge>
        }
        onClick={handleOpen(true)}
        sx={{ border: 'none' }}
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
          {shopInfo && cartItems.length > 0 &&
            <div className={`cart-shop-info ${paymentStep === 'DONE' ? "hide" : ""}`}>
              <div className="shop-info-wrapper">
                <Image
                  className="shop-info-img"
                  src={shopInfo.profileImg}
                  alt={shopInfo.shopName}
                  width={36}
                  height={36}
                />
                {shopInfo.shopName}
              </div>
              <div className="shop-time-wrapper">
                {formatTodayBusinessHours(shopInfo.businessHours || [])}
                <KeyboardArrowRightIcon className="icon" onClick={handleShopPage} />
              </div>
            </div>
          }
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
