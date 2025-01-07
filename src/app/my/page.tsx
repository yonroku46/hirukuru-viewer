"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LinkList from "@/components/LinkList";

import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import AddCardOutlinedIcon from '@mui/icons-material/AddCardOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

export default function MyPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const dummyUser = {
      name: 'テストユーザー',
      profileImage: '/assets/img/no-user.png',
      shopOwner: false,
    }
    setUser(dummyUser);
  }, []);

  const quickLinkList = [
    { title: '最近の注文', href: '/my/history', icon: <ShoppingCartOutlinedIcon /> },
    { title: 'ポイント管理', href: '/my/point', icon: <MonetizationOnOutlinedIcon /> },
    { title: 'クーポン', href: '/my/coupon', icon: <LocalOfferOutlinedIcon /> },
  ];
  const linkList = [
    { title: '注文履歴', href: '/my/history', icon: <HistoryOutlinedIcon /> },
    { title: '支払い設定', href: '/my/history', icon: <AddCardOutlinedIcon /> },
    { title: 'レビュー', href: '/my/history', icon: <SmsOutlinedIcon /> },
    { title: '退会', href: '/my/withdraw', icon: <LogoutOutlinedIcon /> },
  ];

  if (!user) return null;

  return (
    <article>
      <div className="my container">
        {/* User Info */}
        <div className="user-info">
          <div className="user-name">
            <h1>{user.name}</h1>
          </div>
          {user.shopOwner && (
            <button className="shop-mode-btn" onClick={() => {
              router.push('/myshop');
            }}>
              ショップ管理
            </button>
          )}
        </div>
        {/* Order Management */}
        <div className="order-management">
          <label>購入管理</label>
          <div className="order-management-items-wrapper">
            <div className="order-management-item">
              購入済み
              <div className="value">
                {0}
              </div>
            </div>
            <div className="order-management-item">
              受け取り予定
              <div className="value">
                {0}
              </div>
            </div>
            <div className="order-management-item">
              受け取り完了
              <div className="value">
                {0}
              </div>
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
