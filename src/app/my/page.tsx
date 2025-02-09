"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "@/components/Image";
import LinkList from "@/components/LinkList";
import OrderStatus from "@/components/OrderStatus";
import { currency } from "@/common/utils/StringUtils";
import NoticeBoard from "@/components/NoticeBoard";
import ReviewStatus from "@/components/ReviewStatus";
import MiniButton from "@/components/button/MiniButton";
import UserService from "@/api/service/UserService";
import { useAppSelector } from "@/store";

import ShoppingBasketOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined';
import AddCardOutlinedIcon from '@mui/icons-material/AddCardOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import QrCodeScannerOutlinedIcon from '@mui/icons-material/QrCodeScannerOutlined';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import StoreTwoToneIcon from '@mui/icons-material/StoreTwoTone';

export default function MyPage() {
  const router = useRouter();
  const authState = useAppSelector((state) => state.auth);

  const userService = UserService();

  const [user, setUser] = useState<UserState | null>(null);

  const getUserInfo = useCallback(() => {
    userService.userInfo().then((user) => {
      if (user) {
        setUser(user);
      }
    });
  }, [userService]);

  useEffect(() => {
    if (!authState.hasLogin) {
      router.replace('/login');
      return;
    } else if (!user) {
      getUserInfo();
    }
  }, [user, router, authState.hasLogin, getUserInfo]);

  const orderStatus: OrderStatus[] = [
    { status: 'booked', value: 0 },
    { status: 'pickup', value: 1 },
    { status: 'done', value: 1 },
    { status: 'review', value: 1 },
    { status: 'cancel', value: 0 }
  ];
  const reviewStatus: ReviewStatus[] = [
    { status: 'count', value: 1100 },
    { status: 'avg', value: 4.5 },
  ];
  const quickLinkList = [
    { title: '注文管理', href: '/my/order', icon: <ShoppingBasketOutlinedIcon /> },
    { title: 'レビュー', href: '/my/order/review', icon: <SmsOutlinedIcon /> },
    { title: 'お気に入り', href: '/my/favorite', icon: <FavoriteBorderOutlinedIcon /> },
    { title: 'ポイント管理', href: '/my/point', icon: <MonetizationOnOutlinedIcon />, disabled: true },
    { title: 'クーポン', href: '/my/coupon', icon: <LocalOfferOutlinedIcon />, disabled: true },
  ];
  const linkList = [
    { title: '支払い設定', href: '/my/credit', icon: <AddCardOutlinedIcon /> },
    { title: 'お問い合わせ', href: '/service/contact', icon: <SupportAgentIcon /> },
    { title: '退会', href: '/my/withdraw', icon: <LogoutOutlinedIcon /> },
  ];

  if (!user) return null;

  return (
    <article>
      <div className="my container">
        {/* Shop Mode Button */}
        {!user.shopOwner && (
          <Link className="shop-mode-btn" href="/myshop">
            <div className="title">
              <StoreTwoToneIcon />
              ショップ管理へ移動
            </div>
            <KeyboardArrowRightIcon className="arrow-icon" />
          </Link>
        )}
        {/* User Info */}
        <div className="user-info">
          <div className="user-profile-wrapper">
            <Image
              src={user.profileImg}
              alt={user.userName}
              width={74}
              height={74}
            />
            <div className="user-name-wrapper">
              <h1 className="user-name">
                {user.userName}
              </h1>
              <p className="user-point">
                {currency(user.point || 0)}
                <span className="unit">p</span>
              </p>
            </div>
          </div>
          <div className="user-action-wrapper">
            <MiniButton
              icon={<QrCodeScannerOutlinedIcon />}
              onClick={() => {}}
            />
            <MiniButton
              icon={<SettingsOutlinedIcon />}
              onClick={() => {}}
            />
          </div>
        </div>
        {/* Status */}
        <OrderStatus
          statusList={orderStatus}
        />
        <ReviewStatus
          statusList={reviewStatus}
        />
        {/* Link List */}
        <LinkList
          title="クイックリンク"
          linkList={quickLinkList}
        />
        <LinkList
          title="ユーザー機能"
          linkList={linkList}
        />
        {/* Notice */}
        <NoticeBoard
          title={"ご確認お願いします！"}
          contents={[
            "マイページに登録されている個人情報（名前、メールアドレスなど）に不正が確認された場合、事前の通知なしにアカウントを停止する場合があります。",
            "現在の予約状況、受け取り予定、完了したサービスを必ずご確認ください。",
            "保有ポイントや利用可能なクーポンの残高を確認し、期限切れに注意してください。",
            "重要な情報を見逃さないよう、通知設定（メールやプッシュ通知など）が有効になっているかご確認ください。",
          ]}
        />
      </div>
    </article>
  );
}
