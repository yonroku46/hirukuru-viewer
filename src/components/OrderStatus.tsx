"use client";

import { currency, orderStatusDict } from '@/common/utils/StringUtils';
import Title from '@/components/layout/Title';

interface OrderStatusProps {
  title?: string;
  statusList: OrderStatusCount[];
}

export default function OrderStatus({ title, statusList }: OrderStatusProps) {
  const statusLabels: { status: OrderStatusCount['status'], label: string, icon: React.ReactNode }[] = [
    { status: 'BOOKED', label: orderStatusDict('BOOKED', 'label') as string, icon: orderStatusDict('BOOKED', 'icon') },
    { status: 'PICKUP', label: orderStatusDict('PICKUP', 'label') as string, icon: orderStatusDict('PICKUP', 'icon') },
    { status: 'DONE', label: orderStatusDict('DONE', 'label') as string, icon: orderStatusDict('DONE', 'icon') },
  ];
  const statusOptionalLabels: { status: OrderStatusCount['status'], label: string }[] = [
    { status: 'PENDING', label: orderStatusDict('PENDING', 'label') as string },
    { status: 'CANCEL', label: orderStatusDict('CANCEL', 'label') as string },
  ];

  return (
    <div className="status">
      {title && (
        <Title
          title={title}
        />
      )}
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