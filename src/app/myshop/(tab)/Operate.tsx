import React, { Suspense, useEffect, useState } from 'react';
import Loading from '@/app/loading';
import ViewTitle from '@/components/layout/ViewTitle';
import { currency, payTypeDict } from '@/common/utils/StringUtils';
import { dateNow } from '@/common/utils/DateUtils';
// import PartnerService from '@/api/service/PartnerService';
import dayjs from 'dayjs';
import MiniButton from '@/components/button/MiniButton';
import OrderStatus from '@/components/OrderStatus';

import TuneIcon from '@mui/icons-material/Tune';
import QrCodeScannerOutlinedIcon from '@mui/icons-material/QrCodeScannerOutlined';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import OrderStepper from '@/components/OrderStepper';

interface SettingProps {
  isSp: boolean;
  shop: Shop;
}

function Operate({ isSp, shop }: SettingProps)  {

  // const partnerService = PartnerService();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [orderList, setOrderList] = useState<OrderState[]>([]);
  const [orderStatus, setOrderStatus] = useState<OrderStatusCount[]>([]);
  const [currentTime, setCurrentTime] = useState<string>(dateNow().format('HH:mm'));

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
        status: 'DONE',
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
            {/* 現在地公開（営業開始・終了）、自動予約承認、お渡し時間設定、受取済み表示・非表示、予約注文受け取る・受け取らない */}
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
              <div key={order.orderId} className="order-item" onClick={() => {}}>
                <div className="order-header-wrapper">
                  <div className="order-header">
                    <OrderStepper
                      minimal
                      currentStatus={order.status}
                    />
                    <div className="order-id">
                      {`注文番号 #${order.orderId}`}
                    </div>
                  </div>
                  <div className="action-group">
                    <button>
                      <ArrowDropDownIcon />
                    </button>
                  </div>
                </div>
                <div className="order-detail">
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default React.memo(Operate);
