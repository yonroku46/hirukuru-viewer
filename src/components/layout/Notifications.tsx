
"use client";

import { useState } from "react";
import dayjs from "dayjs";
import MiniButton from "@/components/button/MiniButton";

import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

interface NotificationsProps {
  count: number;
  notifications: NotificationInfo[];
  setNotifications: (notifications: NotificationInfo[]) => void;
  onClick: (notificationId: string) => void;
}

export default function Notifications({ count, notifications, setNotifications, onClick }: NotificationsProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState<boolean>(false);

  const handleClick = (notificationId: string) => {
    onClick(notificationId);
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

  return (
    <>
      <MiniButton
        icon={
          <Badge color="secondary" variant="standard" badgeContent={count} max={9}
            sx={{ '& .MuiBadge-badge': { backgroundColor: 'var(--badge-color)' } }}
          >
            <NotificationsIcon />
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
        MenuListProps={{
          sx: {
            p: 0,
          },
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
            },
          },
        }}
      >
        {notifications.map((notification, index) => (
          <MenuItem
            key={index}
            className={`notification-item ${notification.readFlg ? "" : "unread"}`}
            onClick={() => handleClick(notification.notificationId)}
            onTouchStart={() => handleRead(notification)}
            onMouseOver={() => handleRead(notification)}
          >
            <div className="notification-title-wrapper">
              <div className="notification-title">
                {notification.title}
              </div>
              <div className="notification-time">
                {dayjs(notification.createTime).format('MM/DD HH:mm')}
              </div>
            </div>
            <div className="notification-message">
              {notification.message}
            </div>
            <span className="notification-alert" />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};