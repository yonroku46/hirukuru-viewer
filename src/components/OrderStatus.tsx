"use client";

import { currency, orderStatusDict } from '@/common/utils/StringUtils';

import AlarmOnOutlinedIcon from '@mui/icons-material/AlarmOnOutlined';
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';

interface OrderStatusProps {
  statusList: OrderStatusCount[];
}

export default function OrderStatus({ statusList }: OrderStatusProps) {
  const statusLabels: { status: OrderStatusCount['status'], label: string, icon: React.ReactNode }[] = [
    { status: 'BOOKED', label: orderStatusDict('BOOKED', 'label'), icon: <AlarmOnOutlinedIcon fontSize="inherit" /> },
    { status: 'PICKUP', label: orderStatusDict('PICKUP', 'label'), icon: <FmdGoodOutlinedIcon fontSize="inherit" /> },
    { status: 'DONE', label: orderStatusDict('DONE', 'label'), icon: <ThumbUpAltOutlinedIcon fontSize="inherit" /> },
  ];
  const statusOptionalLabels: { status: OrderStatusCount['status'], label: string }[] = [
    { status: 'REVIEW', label: orderStatusDict('REVIEW', 'label') },
    { status: 'CANCEL', label: orderStatusDict('CANCEL', 'label') },
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
                <div className={`icon ${status.toLowerCase()}`}>
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