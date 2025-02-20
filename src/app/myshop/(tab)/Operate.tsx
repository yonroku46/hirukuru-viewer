import React, { Suspense, useCallback, useEffect, useState } from 'react';
import Loading from '@/app/loading';
import Title from '@/components/layout/Title';
import { currency, orderStatusDict, payTypeDict } from '@/common/utils/StringUtils';
import PartnerService from '@/api/service/PartnerService';
import dayjs from 'dayjs';
import MiniButton from '@/components/button/MiniButton';

import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import SearchInput from '@/components/input/SearchInput';

interface SettingProps {
  isSp: boolean;
  shop: Shop;
}

function Operate({ isSp, shop }: SettingProps)  {

  const partnerService = PartnerService();

  const [searchValue, setSearchValue] = useState<string>("");
  const [orderList, setOrderList] = useState<OrderState[]>([]);

  const getOrderList = useCallback(() => {
    partnerService.getOrderedList().then((res) => {
      if (res?.list) {
        setOrderList(res.list);
      }
    });
  }, [partnerService]);

  useEffect(() => {
    console.log(shop);
    getOrderList();
  }, [shop, getOrderList]);

  return (
    <Suspense fallback={<Loading circular />}>
      <div className="tab-contents operate">
        <div className="tab-title">
          <Title
            title="営業状況"
          />
          <div className="edit-btn-group">
            <MiniButton
              icon={<GpsFixedIcon />}
              onClick={() => {}}
              label={isSp ? undefined : "位置確認"}
            />
          </div>
        </div>
        <div className="order-list-filter">
          <SearchInput
            searchMode
            placeholder="注文IDを検索"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <div className="order-list-wrapper">
          <div className="order-item header">
            <div>受け取り時間</div>
            <div>ステータス</div>
            <div>支払い状況</div>
            <div>注文内容</div>
            <div>注文金額</div>
          </div>
          {orderList.map((order) => (
            <div key={order.orderId} className="order-item">
              <div>{dayjs(order.pickupTime).format('HH:mm')}</div>
              <div>{orderStatusDict(order.status, 'label')}</div>
              <div>{payTypeDict(order.payType, 'status')}</div>
              <div>
                {order.orderDetail.length > 1
                  ? `${order.orderDetail[0].itemName}外${order.orderDetail.length}点`
                  : order.orderDetail[0].itemName
                }
              </div>
              <div>{currency(order.totalPrice)}</div>
            </div>
          ))}
        </div>
      </div>
    </Suspense>
  );
};

export default React.memo(Operate);
