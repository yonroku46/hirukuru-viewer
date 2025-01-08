"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "@/components/Image";
import LinkList from "@/components/LinkList";
import { currency } from "@/common/utils/StringUtils";

import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import AddCardOutlinedIcon from '@mui/icons-material/AddCardOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import IconButton from "@mui/material/IconButton";
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import QrCodeScannerOutlinedIcon from '@mui/icons-material/QrCodeScannerOutlined';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import StoreTwoToneIcon from '@mui/icons-material/StoreTwoTone';

export default function MyPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const dummyUser = {
      name: 'テストユーザー',
      profileImage: '/assets/img/no-user.jpg',
      point: 1000,
      shopOwner: false,
    }
    setUser(dummyUser);
  }, []);

  const quickLinkList = [
    { title: '最近の注文', href: '/my/history', icon: <ShoppingCartOutlinedIcon /> },
    { title: 'お気に入り', href: '/my/favorite', icon: <FavoriteBorderOutlinedIcon /> },
    { title: 'レビュー', href: '/my/review', icon: <SmsOutlinedIcon /> },
    { title: 'クーポン', href: '/my/coupon', icon: <LocalOfferOutlinedIcon /> },
  ];
  const linkList = [
    { title: '注文履歴', href: '/my/history', icon: <HistoryOutlinedIcon /> },
    { title: '支払い設定', href: '/my/credit', icon: <AddCardOutlinedIcon /> },
    { title: 'ポイント管理', href: '/my/point', icon: <MonetizationOnOutlinedIcon /> },
    { title: '退会', href: '/my/withdraw', icon: <LogoutOutlinedIcon /> },
  ];

  if (!user) return null;

  return (
    <article>
      <div className="my container">
        {/* Shop Mode Button */}
        {user.shopOwner && (
          <div className="shop-mode-btn" onClick={() => router.push('/myshop')}>
            <div className="title">
              <StoreTwoToneIcon />
              ショップ管理モード
            </div>
            <KeyboardArrowRightIcon className="arrow-icon" />
          </div>
        )}
        {/* User Info */}
        <div className="user-info">
          <div className="user-profile-wrapper">
            <Image
              src={user.profileImage}
              alt={user.name}
              width={80}
              height={80}
            />
            <div className="user-name-wrapper">
              <h1 className="user-name">
                {user.name}
              </h1>
              <p className="user-point">
                {currency(user.point)}
                <span className="unit">p</span>
              </p>
            </div>
          </div>
          <div className="user-action-wrapper">
            <IconButton className="action-btn">
              <QrCodeScannerOutlinedIcon />
            </IconButton>
            <IconButton className="action-btn">
              <SettingsOutlinedIcon />
            </IconButton>
          </div>
        </div>
        {/* Order Management */}
        <div className="order-management">
          <div className="order-management-items-wrapper">
            <div className="order-management-item">
              <div className="value">
                {0}
              </div>
              <label>予約</label>
            </div>
            <div className="order-management-item">
              <div className="value">
                {0}
              </div>
              <label>受け取り予定</label>
            </div>
            <div className="order-management-item">
              <div className="value">
                {0}
              </div>
              <label>完了・レビュー待ち</label>
            </div>
            <div className="order-management-item">
              <div className="value">
                {0}
              </div>
              <label>キャンセル</label>
            </div>
          </div>
        </div>
        {/* Quick Link List */}
        <LinkList
          title="クイックリンク"
          linkList={quickLinkList}
        />
        {/* Link List */}
        <LinkList
          title="ユーザー機能"
          linkList={linkList}
        />
      </div>
    </article>
  );
}
