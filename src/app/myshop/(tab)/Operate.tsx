import React, { Suspense, useEffect, useMemo, useState } from 'react';
import Loading from '@/app/loading';
import ViewTitle from '@/components/layout/ViewTitle';
import { currency, payTypeDict } from '@/common/utils/StringUtils';
import { dateNow } from '@/common/utils/DateUtils';
// import PartnerService from '@/api/service/PartnerService';
import dayjs from 'dayjs';
import MiniButton from '@/components/button/MiniButton';
import OrderStatus from '@/components/OrderStatus';
import OrderStepper from '@/components/OrderStepper';
import ConfirmDialog from '@/components/ConfirmDialog';
import Selector from '@/components/input/Selector';

import TuneIcon from '@mui/icons-material/Tune';
import QrCodeScannerOutlinedIcon from '@mui/icons-material/QrCodeScannerOutlined';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import WarningIcon from '@mui/icons-material/Warning';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

interface SettingProps {
  isSp: boolean;
  shop: Shop;
}

function Operate({ isSp, shop }: SettingProps)  {

  // const partnerService = PartnerService();

  const cancelReasonList = useMemo(() => [
    { value: '在庫切れ', label: '在庫切れ' },
    { value: '現在注文量が多いため', label: '現在注文量が多いため' },
    { value: '自然災害/事故', label: '自然災害/事故' },
    { value: 'その他', label: 'その他' },
  ], []);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);
  const [cancelOrderId, setCancelOrderId] = useState<string | undefined>(undefined);
  const [cancelReason, setCancelReason] = useState<string>(cancelReasonList[0].value);
  const [orderList, setOrderList] = useState<OrderState[]>([]);
  const [orderStatus, setOrderStatus] = useState<OrderStatusCount[]>([]);
  const [currentTime, setCurrentTime] = useState<string>(dateNow().format('HH:mm'));
  const [expandedOrderIds, setExpandedOrderIds] = useState<Set<string>>(new Set());

  const toggleOrderDetail = (orderId: string) => {
    setExpandedOrderIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const handleOrderCancel = (e: React.MouseEvent<HTMLButtonElement>, orderId: string) => {
    e.stopPropagation();
    setCancelOrderId(orderId);
    setCancelReason(cancelReasonList[0].value);
    setOpenConfirm(true);
  }

  const handleOrderCancelConfirm = () => {
    setCancelOrderId(undefined);
    setCancelReason(cancelReasonList[0].value);
    setOpenConfirm(false);
    console.log(cancelOrderId, cancelReason);
  };

  const handleOrderStatusChange = (e: React.MouseEvent<HTMLButtonElement>, orderId: string, status: OrderStatus['status']) => {
    e.stopPropagation();
    console.log(orderId, status);
  }

  // const getOrderList = useCallback(() => {
  //   partnerService.getOrderedList().then((res) => {
  //     if (res?.list) {
  //       setOrderList(res.list);
  //     }
  //   });
  // }, [partnerService]);

  useEffect(() => {
    const updateCurrentTime = () => {
      setCurrentTime(dateNow().format('HH:mm'));
    };

    const seconds = dayjs().second();
    const initialTimeout = (60 - seconds) * 1000;

    const timeoutId = setTimeout(() => {
      updateCurrentTime();
      const intervalId = setInterval(updateCurrentTime, 60000);

      return () => clearInterval(intervalId);
    }, initialTimeout);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    console.log(shop);
    // getOrderList();
    setOrderList([
      {
        orderId: '101',
        pickupTime: '2024-01-01 10:00',
        status: 'PENDING',
        payType: 'CASH',
        orderDetail: [
          {
            orderId: '101',
            itemId: '1',
            itemName: '商品1',
            itemPrice: 1000,
            options: [],
            quantity: 1,
            itemTotalPrice: 1000,
          }
        ],
        totalPrice: 1000,
        shopName: '店舗1',
        shopId: '1',
        userId: '1',
        createTime: '2024-01-01 10:00',
        id: '1',
      },
      {
        orderId: '102',
        pickupTime: '2024-01-01 10:00',
        status: 'BOOKED',
        payType: 'CASH',
        orderDetail: [
          {
            orderId: '102',
            itemId: '1',
            itemName: '商品2',
            itemPrice: 1000,
            options: [],
            quantity: 1,
            itemTotalPrice: 1000,
          }
        ],
        totalPrice: 1000,
        shopName: '店舗1',
        shopId: '1',
        userId: '1',
        createTime: '2024-01-01 10:00',
        id: '2',
      },
      {
        orderId: '103',
        pickupTime: '2024-01-01 10:00',
        status: 'PICKUP',
        payType: 'CASH',
        orderDetail: [
          {
            orderId: '103',
            itemId: '1',
            itemName: '商品3',
            itemPrice: 1000,
            options: [],
            quantity: 1,
            itemTotalPrice: 1000,
          }
        ],
        totalPrice: 1000,
        shopName: '店舗1',
        shopId: '1',
        userId: '1',
        createTime: '2024-01-01 10:00',
        id: '2',
      },
      {
        orderId: '104',
        pickupTime: '2024-01-01 10:00',
        status: 'DONE',
        payType: 'CASH',
        orderDetail: [
          {
            orderId: '104',
            itemId: '1',
            itemName: '商品4',
            itemPrice: 1000,
            options: [],
            quantity: 1,
            itemTotalPrice: 1000,
          }
        ],
        totalPrice: 1000,
        shopName: '店舗1',
        shopId: '1',
        userId: '1',
        createTime: '2024-01-01 10:00',
        id: '2',
      },
      {
        orderId: '105',
        pickupTime: '2024-01-01 10:00',
        status: 'CANCEL',
        payType: 'CASH',
        orderDetail: [
          {
            orderId: '105',
            itemId: '1',
            itemName: '商品4',
            itemPrice: 1000,
            options: [],
            quantity: 1,
            itemTotalPrice: 1000,
          }
        ],
        totalPrice: 1000,
        shopName: '店舗1',
        shopId: '1',
        userId: '1',
        createTime: '2024-01-01 10:00',
        id: '2',
      }
    ]);
    setOrderStatus([
      {
        status: 'PENDING',
        value: 4,
      },
      {
        status: 'DONE',
        value: 7,
      },
      {
        status: 'PICKUP',
        value: 0,
      },
    ]);
    setIsOpen(true);
  }, [shop]);

  return (
    <Suspense fallback={<Loading circular />}>
      <div className="tab-contents operate">
        <div className="tab-title">
          <div className="title-wrapper">
            <ViewTitle
              title={isOpen ? "現在営業中" : "営業終了"}
              description="営業状況"
            />
          </div>
          <div className="edit-btn-group">
            <MiniButton
              icon={<QrCodeScannerOutlinedIcon />}
              onClick={() => {}}
              label={isSp ? undefined : "QRコード"}
            />
            <MiniButton
              icon={<TuneIcon />}
              onClick={() => {}}
              label={isSp ? undefined : "営業設定"}
            />
            {/* 現在地公開（営業開始・終了）、自動予約承認、お渡し時間設定、受取済み表示・非表示、
            予約注文受け取る・受け取らない */}
          </div>
        </div>
        <div className="order-filter-wrapper">
          <div className="current-time">
            <label className="time-label">
              {parseInt(currentTime.split(':')[0]) < 12 ? "AM" : "PM"}
            </label>
            {currentTime}
          </div>
          <OrderStatus
            statusList={orderStatus}
          />
        </div>
        <div className="order-list-wrapper">
          {/* 注文履歴 */}
          <div className="order-list">
            {orderList.map((order) => (
              <div key={order.orderId} className="order-item" onClick={() => toggleOrderDetail(order.orderId)}>
                <div className="order-header-wrapper">
                  <div className="order-header">
                    <OrderStepper
                      minimal
                      currentStatus={order.status}
                    />
                    <div className="order-time">
                      {dayjs(order.pickupTime).format('HH:mm')}
                    </div>
                  </div>
                  <div className="action-group">
                    <div className="order-id">
                      {`注文番号 #${order.orderId}`}
                    </div>
                    <button className={`arrow-btn ${expandedOrderIds.has(order.orderId) ? 'open' : ''}`}>
                      <ArrowRightIcon />
                    </button>
                  </div>
                </div>
                <div className={`order-detail ${expandedOrderIds.has(order.orderId) ? '' : 'hidden'}`}>
                  <div className="order-info">
                    <div className="order-time">
                      <label>受け取り時間</label>
                      <p className="value">
                        {dayjs(order.pickupTime).format('HH:mm')}
                      </p>
                    </div>
                    <div className="order-content">
                      <label>注文内容</label>
                      <p className="value">
                        {order.orderDetail.length > 1
                          ? `${order.orderDetail[0].itemName}外${order.orderDetail.length}点`
                          : order.orderDetail[0].itemName
                        }
                      </p>
                    </div>
                    <div className="order-pay-type">
                      <label>支払い状況</label>
                      <p className="value">
                        {payTypeDict(order.payType, 'status')}
                      </p>
                    </div>
                    <div className="order-total-price">
                      <label>支払い金額</label>
                      <p className="value">
                        {currency(order.totalPrice, "円")}
                      </p>
                    </div>
                  </div>
                  <div className="order-actions">
                    {order.status !== 'CANCEL' && order.status !== 'DONE' && (
                      <button className="action-btn cancel" onClick={(e) => handleOrderCancel(e, order.orderId)}>
                        キャンセル
                      </button>
                    )}
                    {order.status === 'PENDING' && (
                      <button className="action-btn booked" onClick={(e) => handleOrderStatusChange(e, order.orderId, 'BOOKED')}>
                        注文承認
                        <KeyboardArrowRightIcon />
                      </button>
                    )}
                    {order.status === 'BOOKED' && (
                      <button className="action-btn pickup" onClick={(e) => handleOrderStatusChange(e, order.orderId, 'PICKUP')}>
                        準備完了
                        <KeyboardArrowRightIcon />
                      </button>
                    )}
                    {order.status === 'PICKUP' && (
                      <button className="action-btn done" onClick={(e) => handleOrderStatusChange(e, order.orderId, 'DONE')}>
                        受取済み
                        <KeyboardArrowRightIcon />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ConfirmDialog
        icon={<WarningIcon />}
        title="注文を取り消しますか？"
        description={`理由を選択してください。\n取り消した注文は復旧できません。`}
        optional={
          <Selector
            options={cancelReasonList}
            value={cancelReason ?? ''}
            onChange={(e) => setCancelReason(e.target.value)}
          />
        }
        open={openConfirm}
        setOpen={setOpenConfirm}
        onConfirm={handleOrderCancelConfirm}
        onCancel={() => setOpenConfirm(false)}
      />
    </Suspense>
  );
};

export default React.memo(Operate);
