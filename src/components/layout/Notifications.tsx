
"use client";

import { useState } from "react";
import MiniButton from "@/components/button/MiniButton";
import { formatRelativeTime } from "@/common/utils/DateUtils";

import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";

const AnimatedNotificationsIcon = styled(NotificationsIcon)(({}) => ({
  '&.active': {
    transformOrigin: 'top center',
    animation: 'shake 4s infinite',
  },
}));

interface NotificationsProps {
  currentTime: string;
  count: number;
  notifications: NotificationInfo[];
  setNotifications: (notifications: NotificationInfo[]) => void;
  onClick: (notification: NotificationInfo) => void;
}

export default function Notifications({ currentTime, count, notifications, setNotifications, onClick }: NotificationsProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState<boolean>(false);

  const handleClick = (notification: NotificationInfo) => {
    onClick(notification);
    setAnchorEl(null);
    setOpen(false);
  };

  const handleRead = (notification: NotificationInfo) => {
    if (!notification.readFlg) {
      setNotifications(notifications.map((n) =>
        n.notificationId === notification.notificationId
          ? { ...n, readFlg: true }
          : n
      ));
    }
  };

  const sortedNotifications = [...notifications].sort((a, b) => {
    return new Date(b.createTime).getTime() - new Date(a.createTime).getTime();
  });

  return (
    <>
      <MiniButton
        icon={
          <Badge color="secondary" variant="standard" badgeContent={count} max={9}
            sx={{ '& .MuiBadge-badge': { backgroundColor: 'var(--badge-color)' } }}
          >
            <AnimatedNotificationsIcon className={count > 0 ? 'active' : ''} />
          </Badge>
        }
        onClick={(event) => {
          setAnchorEl(event.currentTarget);
          setOpen(true);
        }}
      />
      <Menu
        className="notification-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => {
          setAnchorEl(null);
          setOpen(false);
        }}
        slotProps={{
          paper: {
            style: {
              maxHeight: 400,
              width: '300px',
              marginTop: "0.25rem",
              border: "1px solid var(--gray-alpha-300)",
              borderRadius: "0.75rem",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
              scrollbarColor: "var(--gray-alpha-300) transparent",
            },
          },
          list: {
            style: {
              padding: 0
            },
          },
        }}
      >
        {sortedNotifications.length > 0 ?
          sortedNotifications.map((notification, index) => (
            <MenuItem
              key={index}
              className={`notification-item ${notification.readFlg ? "" : "unread"}`}
              onClick={() => handleClick(notification)}
              onTouchStart={() => handleRead(notification)}
              onMouseOver={() => handleRead(notification)}
            >
              <div className="notification-title-wrapper">
                <div className="notification-title">
                  {notification.title}
                </div>
                <div className="notification-time">
                  {formatRelativeTime(notification.createTime, currentTime)}
                </div>
              </div>
              <div className="notification-message">
                {notification.message}
              </div>
              <span className="notification-alert" />
            </MenuItem>
          ))
          : (
            <MenuItem className="notification-item empty" disabled>
              通知がありません
            </MenuItem>
          )
        }
      </Menu>
    </>
  );
};