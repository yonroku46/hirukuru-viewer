import React, { Suspense, useEffect, useState } from 'react';
import Loading from '@/app/loading';
import Title from '@/components/layout/Title';
import { currency, orderStatusDict, payTypeDict } from '@/common/utils/StringUtils';
import { dateNow } from '@/common/utils/DateUtils';
// import PartnerService from '@/api/service/PartnerService';
import dayjs from 'dayjs';
import MiniButton from '@/components/button/MiniButton';
import OrderStatus from '@/components/OrderStatus';

import TuneIcon from '@mui/icons-material/Tune';
import QrCodeScannerOutlinedIcon from '@mui/icons-material/QrCodeScannerOutlined';
import Chip from '@mui/material/Chip';

interface SettingProps {
  isSp: boolean;
  shop: Shop;
}

function Operate({ isSp, shop }: SettingProps)  {

  // const partnerService = PartnerService();

  const [orderList, setOrderList] = useState<OrderState[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderState | null>(null);
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
        orderId: '1',
        pickupTime: '2024-01-01 10:00',
        status: 'PENDING',
        payType: 'CASH',
        orderDetail: [
          {
            orderId: '1',
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
        orderId: '2',
        pickupTime: '2024-01-01 10:00',
        status: 'DONE',
        payType: 'CASH',
        orderDetail: [
          {
            orderId: '1',
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
  }, [shop]);

  return (
    <Suspense fallback={<Loading circular />}>
      <div className="tab-contents operate">
        <div className="tab-title">
          <Title
            title="営業状況"
          />
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
            {/* 現在地公開（営業開始・終了）、自動予約承認、お渡し時間設定、受取済み表示・非表示 */}
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
              <div key={order.orderId} className="order-item" onClick={() => setSelectedOrder(order)}>
                <div className="order-header">
                  <Chip
                    size="small"
                    label={
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        {orderStatusDict(order.status, 'icon')}
                        {orderStatusDict(order.status, 'label') as string}
                      </div>
                    }
                    sx={{
                      backgroundColor: orderStatusDict(order.status, 'color') as string,
                      color: 'var(--background)',
                      width: '110px',
                      height: '28px',
                      fontSize: '0.95rem',
                    }}
                  />
                  <div className="order-id">
                    {order.orderId}
                  </div>
                  <div className="order-time">{dayjs(order.pickupTime).format('HH:mm')}</div>
                </div>
                <div className="order-detail">
                  {order.orderDetail.length > 1
                    ? `${order.orderDetail[0].itemName}外${order.orderDetail.length}点`
                    : order.orderDetail[0].itemName
                  }
                  <div>{payTypeDict(order.payType, 'status')}</div>
                </div>
              </div>
            ))}
          </div>
          {/* 注文詳細 */}
          <div className="order-view">
            {selectedOrder ?
              <div>
                <div className="pickup-time">
                  <label>受け取り時間</label>
                  <div>{dayjs(selectedOrder.pickupTime).format('HH:mm')}</div>
                </div>
                <div className="status">
                  <label>ステータス</label>
                  <div>{orderStatusDict(selectedOrder.status, 'label')}</div>
                </div>
                <div className="pay-type">
                  <label>支払い状況</label>
                  <div>{payTypeDict(selectedOrder.payType, 'status')}</div>
                </div>
                <div className="order-detail">
                  <label>注文内容</label>
                  {selectedOrder.orderDetail.length > 1
                    ? `${selectedOrder.orderDetail[0].itemName}外${selectedOrder.orderDetail.length}点`
                    : selectedOrder.orderDetail[0].itemName
                  }
                </div>
                <div className="total-price">
                  <label>注文金額</label>
                  <div>{currency(selectedOrder.totalPrice)}</div>
                </div>
                <div className="order-detail-actions">
                  <button>受け取り</button>
                  <button>キャンセル</button>
                </div>
              </div>
              :
              <>
                注文を選択してください
              </>
            }
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default React.memo(Operate);
