"use client";

import { currency } from '@/common/utils/StringUtils';

import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';

interface ReviewStatusProps {
  statusList: ReviewStatus[];
}

export default function ReviewStatus({ statusList }: ReviewStatusProps) {
  const statusLabels = [
    { type: 'count', label: '評価件数', icon: <TaskAltOutlinedIcon fontSize="inherit" /> },
    { type: 'avg', label: '平均評価', icon: <StarBorderOutlinedIcon fontSize="inherit" /> },
  ];

  return (
    <div className="status">
      <h2 className="title">
        マイレビュー
      </h2>
      <div className="status-items-wrapper two-columns">
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
      </div>
    </div>
  );
};