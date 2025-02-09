"use client";

import { currency, orderStatusDict } from '@/common/utils/StringUtils';

import AlarmOnOutlinedIcon from '@mui/icons-material/AlarmOnOutlined';
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';

interface OrderStatusProps {
  statusList: OrderStatus[];
}

export default function OrderStatus({ statusList }: OrderStatusProps) {
  const statusLabels: { status: OrderStatus['status'], label: string, icon: React.ReactNode }[] = [
    { status: 'booked', label: orderStatusDict('booked', 'label'), icon: <AlarmOnOutlinedIcon fontSize="inherit" /> },
    { status: 'pickup', label: orderStatusDict('pickup', 'label'), icon: <FmdGoodOutlinedIcon fontSize="inherit" /> },
    { status: 'done', label: orderStatusDict('done', 'label'), icon: <ThumbUpAltOutlinedIcon fontSize="inherit" /> },
  ];
  const statusOptionalLabels: { status: OrderStatus['status'], label: string }[] = [
    { status: 'review', label: orderStatusDict('review', 'label') },
    { status: 'cancel', label: orderStatusDict('cancel', 'label') },
  ];

  return (
    <div className="status">
      <h2 className="title">
        本日の注文状況
      </h2>
      <div className="status-items-wrapper">
        {statusLabels.map(({ status, label, icon }) => {
          const findStatus = statusList.find((s) => s.status === status);
          const isActive = findStatus && findStatus.value > 0;
          return (
            <div key={status} className={`status-item ${isActive ? 'active' : ''}`}>
              <div className="status-item-title">
                <div className={`icon ${status}`}>
                  {icon}
                </div>
                <div className='label'>
                  {label}
                </div>
              </div>
              <div className='value'>
                {currency(findStatus?.value ?? 0)}
              </div>
            </div>
          );
        })}
        <div className="status-item optional">
          {statusOptionalLabels.map(({ status, label }) => {
            const findStatus = statusList.find((s) => s.status === status);
            const isActive = findStatus && findStatus.value > 0;
            return (
              <div key={status} className={`status-item optional-parts ${isActive ? 'active' : ''}`}>
                <div className="status-item-title">
                  <div className='label'>
                    {label}
                  </div>
                </div>
                <div className='value'>
                  {currency(findStatus?.value ?? 0)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};