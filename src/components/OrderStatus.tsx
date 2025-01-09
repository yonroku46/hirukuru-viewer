"use client";

import { currency } from '@/common/utils/StringUtils';

import AlarmOnOutlinedIcon from '@mui/icons-material/AlarmOnOutlined';
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';

interface OrderStatusProps {
  statusList: OrderStatus[];
}

export default function OrderStatus({ statusList }: OrderStatusProps) {
  const statusLabels = [
    { type: 'booked', label: '予約', icon: <AlarmOnOutlinedIcon fontSize="inherit" /> },
    { type: 'pickup', label: '本日の受け取り', icon: <FmdGoodOutlinedIcon fontSize="inherit" /> },
    { type: 'done', label: '完了', icon: <ThumbUpAltOutlinedIcon fontSize="inherit" /> },
  ];
  const statusOptionalLabels = [
    { type: 'review', label: 'レビュー待ち' },
    { type: 'cancel', label: 'キャンセル' },
  ];

  return (
    <div className="order-status">
      <h2 className="title">
        注文状況
      </h2>
      <div className="order-status-items-wrapper">
        {statusLabels.map(({ type, label, icon }) => {
          const status = statusList.find((status) => status.type === type);
          const isActive = status && status.value > 0;
          return (
            <div key={type} className={`order-status-item ${isActive ? 'active' : ''}`}>
              <div className="order-status-item-title">
                <div className={`icon ${type}`}>
                  {icon}
                </div>
                <div className='label'>
                  {label}
                </div>
              </div>
              <div className='value'>
                {currency(status?.value ?? 0)}
              </div>
            </div>
          );
        })}
        <div className="order-status-item optional">
          {statusOptionalLabels.map(({ type, label }) => {
            const status = statusList.find((status) => status.type === type);
            const isActive = status && status.value > 0;
            return (
              <div key={type} className={`order-status-item optional-parts ${isActive ? 'active' : ''}`}>
                <div className="order-status-item-title">
                  <div className='label'>
                    {label}
                  </div>
                </div>
                <div className='value'>
                  {currency(status?.value ?? 0)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};