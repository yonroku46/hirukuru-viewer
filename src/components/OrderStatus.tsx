"use client";

import { currency, orderStatusDict } from '@/common/utils/StringUtils';

import AlarmOnOutlinedIcon from '@mui/icons-material/AlarmOnOutlined';
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';

interface OrderStatusProps {
  statusList: OrderStatus[];
}

export default function OrderStatus({ statusList }: OrderStatusProps) {
  const statusLabels = [
    { type: 'booked', label: orderStatusDict('booked', 'label'), icon: <AlarmOnOutlinedIcon fontSize="inherit" /> },
    { type: 'pickup', label: orderStatusDict('pickup', 'label'), icon: <FmdGoodOutlinedIcon fontSize="inherit" /> },
    { type: 'done', label: orderStatusDict('done', 'label'), icon: <ThumbUpAltOutlinedIcon fontSize="inherit" /> },
  ];
  const statusOptionalLabels = [
    { type: 'review', label: orderStatusDict('review', 'label') },
    { type: 'cancel', label: orderStatusDict('cancel', 'label') },
  ];

  return (
    <div className="status">
      <h2 className="title">
        本日の注文状況
      </h2>
      <div className="status-items-wrapper">
        {statusLabels.map(({ type, label, icon }) => {
          const status = statusList.find((status) => status.type === type);
          const isActive = status && status.value > 0;
          return (
            <div key={type} className={`status-item ${isActive ? 'active' : ''}`}>
              <div className="status-item-title">
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
        <div className="status-item optional">
          {statusOptionalLabels.map(({ type, label }) => {
            const status = statusList.find((status) => status.type === type);
            const isActive = status && status.value > 0;
            return (
              <div key={type} className={`status-item optional-parts ${isActive ? 'active' : ''}`}>
                <div className="status-item-title">
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