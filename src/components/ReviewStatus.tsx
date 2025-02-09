"use client";

import { currency } from '@/common/utils/StringUtils';

import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';

interface ReviewStatusProps {
  statusList: ReviewStatus[];
}

export default function ReviewStatus({ statusList }: ReviewStatusProps) {
  const statusLabels: { status: ReviewStatus['status'], label: string, icon: React.ReactNode }[] = [
    { status: 'count', label: '評価件数', icon: <TaskAltOutlinedIcon fontSize="inherit" /> },
    { status: 'avg', label: '平均評価', icon: <StarBorderOutlinedIcon fontSize="inherit" /> },
  ];

  return (
    <div className="status">
      <h2 className="title">
        マイレビュー
      </h2>
      <div className="status-items-wrapper two-columns">
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
      </div>
    </div>
  );
};