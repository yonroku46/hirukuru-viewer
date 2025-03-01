"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { tokenPrefix } from "@/api";
import { useMediaQuery } from "react-responsive";
import { store, useAppSelector } from "@/store";
import { EventSourcePolyfill } from "event-source-polyfill";
import dayjs from "dayjs";
import AuthService from "@/api/service/AuthService";
import Image from "@/components/Image";
import Notifications from "@/components/layout/Notifications";
import { orderStatusDict } from "@/common/utils/StringUtils";
import { dateNow } from "@/common/utils/DateUtils";
import Dashboard from "./(tab)/Dashboard";
import ShopSetting from "./(tab)/ShopSetting";
import ItemSetting from "./(tab)/ItemSetting";
import CategorySetting from "./(tab)/CategorySetting";
import Operate from "./(tab)/Operate";
import Marketing from "./(tab)/Marketing";
import Review from "./(tab)/Review";
import History from "./(tab)/History";
import Settlement from "./(tab)/Settlement";

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import StoreIcon from '@mui/icons-material/Store';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import DiscountIcon from '@mui/icons-material/Discount';
import TextsmsIcon from '@mui/icons-material/Textsms';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import FlatwareIcon from '@mui/icons-material/Flatware';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import Backdrop from "@mui/material/Backdrop";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

export default function MyShopPage() {
  const isSp = useMediaQuery({ query: "(max-width: 1179px)" });
  const router = useRouter();
  const searchParams = useSearchParams();
  const authState = useAppSelector((state) => state.auth);
  const dispatch = store.dispatch;
  const authService = AuthService(dispatch);

  const menuItems: GroupMenuItem[] = [
    { groupName: "店舗管理", groupHref: "shop", groupItems: [
      { name: "ダッシュボード", href: "dashboard", icon: <SpaceDashboardIcon /> },
      { name: "店舗情報", href: "shop", icon: <StoreIcon /> },
      { name: "商品設定", href: "item", icon: <FlatwareIcon /> },
      { name: "カテゴリ設定", href: "category", icon: <AccountTreeIcon /> },
    ]},
    { groupName: "運営管理", groupHref: "operate", groupItems: [
      { name: "営業状況", href: "operate", icon: <FmdGoodIcon /> },
      { name: "マーケティング", href: "marketing", icon: <DiscountIcon /> },
      { name: "レビュー管理", href: "review", icon: <TextsmsIcon /> },
      { name: "注文履歴", href: "history", icon: <ManageSearchIcon /> },
    ]},
    { groupName: "サービス", groupHref: "service", groupItems: [
      { name: "精算管理", href: "settlement", icon: <PointOfSaleIcon /> },
    ]},
  ];

  const tab = searchParams.get('tab');
  const tabBaseUrl = `/myshop?tab=`;
  const initialTab = menuItems[0].groupItems[0].href;
  const [currentTime, setCurrentTime] = useState<string>(dateNow().format('YYYY-MM-DD HH:mm'));
  const [tabValue, setTabValue] = useState<string>(tab || initialTab);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(true);
  const [shop, setShop] = useState<Shop | null>(null);
  const [notifications, setNotifications] = useState<NotificationInfo[]>([]);
  const [notReadCount, setNotReadCount] = useState<number>(0);
  const eventSourceRef = useRef<EventSource | null>(null);
  const retryCountRef = useRef<number>(0);

  useEffect(() => {
    const updateCurrentTime = () => {
      setCurrentTime(dateNow().format('YYYY-MM-DD HH:mm'));
    };

    const seconds = dayjs().second();
    const initialTimeout = (60 - seconds) * 1000;

    const timeoutId = setTimeout(() => {
      updateCurrentTime();
      const intervalId = setInterval(updateCurrentTime, 60000);

      return () => clearInterval(intervalId);
    }, initialTimeout);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    // 既存のSSE終了
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    // ユーザー情報、店舗情報がない場合はSSE接続不可
    const currentUser = authService.getCurrentUser();
    if (!shop?.shopId || !currentUser) return;

    // SSE接続
    const sseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}:${process.env.NEXT_PUBLIC_API_PORT}${process.env.NEXT_PUBLIC_API_ROOT}/SSE/stream`;
    // const sseUrl = `/api/sse-proxy`;

    try {
      const eventSource: EventSource = new EventSourcePolyfill(sseUrl, {
        headers: {
          Authorization: `${tokenPrefix} ${currentUser.token}`,
          RefreshToken: `${tokenPrefix} ${currentUser.refreshToken}`,
        }
      });
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        console.log('SSE connection opened');
        retryCountRef.current = 0;
      };

      eventSource.addEventListener('orderUpdate', (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          const orderState = data.source as OrderState;
          if (orderState.shopId === shop?.shopId) {
            setNotifications((prevNotifications) => [
              ...prevNotifications,
              {
                notificationId: event.lastEventId,
                receiverId: event.data.receiverId,
                receiverType: "ORDER",
                title: `注文番号 #${orderState.orderId}`,
                message: `注文が「${orderStatusDict(orderState.status, 'label')}」になりました`,
                readFlg: false,
                createTime: new Date().toISOString()
              }
            ]);
          }
        } catch (error) {
          console.error('Order update parsing error:', error);
        }
      });

      eventSource.onerror = (error) => {
        console.error('SSE Error:', {
          timestamp: new Date().toISOString(),
          readyState: eventSource.readyState,
          error: error
        });

        if (eventSource.readyState === EventSource.CLOSED) {
          if (retryCountRef.current < 5) {
            setTimeout(() => {
              if (eventSourceRef.current === eventSource) {
                eventSource.close();
                eventSourceRef.current = null;
                retryCountRef.current += 1;
              }
            }, 5000);
          } else {
            console.error('SSE connection failed after 5 retries');
          }
        }
      };

      return () => {
        eventSource.close();
        eventSourceRef.current = null;
      };
    } catch (error) {
      console.error('EventSource Error:', error);
    }
  }, [shop?.shopId]);

  useEffect(() => {
    const footerElement = document.querySelector('footer');
    if (footerElement) {
      footerElement.style.display = 'none';
    }
    return () => {
      if (footerElement) {
        footerElement.style.display = '';
      }
    };
  }, []);

  useEffect(() => {
    if (!authState.hasLogin) {
      router.replace('/login');
      return;
    }
    if (isSp && isMenuOpen) {
      setIsMenuOpen(false);
    }
    if (tab) {
      if (!menuItems.some((group) => group.groupItems.some((item) => item.href === tab))) {
        router.replace(`${tabBaseUrl}${initialTab}`);
      } else {
        setTabValue(tab);
      }
    } else {
      router.replace(`${tabBaseUrl}${initialTab}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, isSp]);

  useEffect(() => {
    const shop: Shop = {
      shopId: 'd554fe3e-384c-49c3-ba65-d2858ae92ec1',
      shopName: '唐揚げ壱番屋',
      shopIntro: '揚げ物専門店',
      location: '福岡市博多区',
      detailAddress: '福岡市博多区',
      shopType: 'BENTO',
      servingMinutes: 15,
      profileImg: 'https://i.pinimg.com/236x/71/65/43/716543eb8e6907d7163b55000376e2be.jpg',
      thumbnailImg: 'https://i.pinimg.com/736x/64/70/a6/6470a637276c688063bb053c5c116507.jpg',
      businessHours: [
        { dayOfWeek: 'MON', openTime: '10:10', closeTime: '23:50', businessDay: true },
        { dayOfWeek: 'TUE', openTime: '10:10', closeTime: '23:50', businessDay: true },
        { dayOfWeek: 'WED', openTime: '10:10', closeTime: '23:50', businessDay: true },
        { dayOfWeek: 'THU', openTime: '10:10', closeTime: '23:50', businessDay: true },
      ],
      reviewCount: 1120,
      ratingAvg: 4.5,
      rating: {
        "1": 2,
        "2": 8,
        "3": 10,
        "4": 25,
        "5": 55
      }
    };
    setShop(shop);
  }, []);

  useEffect(() => {
    if (notifications.length > 0) {
      setNotReadCount(notifications.filter((notification) => !notification.readFlg).length);
    }
  }, [notifications]);

  if (!shop) return null;

  const tabViewerMap: { [key: string]: JSX.Element } = {
    "dashboard": <Dashboard shop={shop} />,
    "shop": <ShopSetting isSp={isSp} shop={shop} setShop={setShop} />,
    "item": <ItemSetting isSp={isSp} shop={shop} />,
    "category": <CategorySetting isSp={isSp} shop={shop} />,
    "operate": <Operate isSp={isSp} currentTime={currentTime} notifications={notifications} />,
    "marketing": <Marketing isSp={isSp} shop={shop} />,
    "review": <Review shop={shop} />,
    "history": <History />,
    "settlement": <Settlement />,
  };

  return (
    <article>
      <div className="myshop-page">
        <div className="content-header">
          <div className="shop-info" style={{ maxWidth: `calc(1600px + ${isMenuOpen ? "240px" : "4.5rem"} - 2rem)` }}>
            <div className="shop-profile-wrapper" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Image
                src={shop.profileImg}
                alt={shop.shopName}
                width={36}
                height={36}
              />
              <div className="shop-name-wrapper">
                <p className="shop-location">
                  {shop.location}
                </p>
                <p className="shop-name">
                  {shop.shopName}
                </p>
              </div>
              <button
                className={`shop-menu-btn ${isMenuOpen ? "open" : ""}`}
              >
                <KeyboardArrowLeftIcon />
              </button>
            </div>
            <Notifications
              currentTime={currentTime}
              count={notReadCount}
              notifications={notifications}
              setNotifications={setNotifications}
              onClick={(notification) => {
                console.log(notification);
              }}
            />
          </div>
        </div>
        <div className="content-body">
          {/* Tab Menu */}
          <div className={`tab-menu ${isMenuOpen ? "open" : "close"}`}>
              <List sx={{ p: 0 }}>
                {menuItems.map((group) => (
                  <div key={group.groupName} className="tab-menu-group">
                    <ListItem disablePadding>
                      <ListItemButton disabled sx={{ opacity: "0.75 !important", height: "3rem" }}>
                        <ListItemText
                          primary={(isSp || isMenuOpen) ? group.groupName : ""}
                          sx={{
                            borderBottom: (isSp || isMenuOpen) ? "none" : "1px solid var(--gray-alpha-400)",
                            whiteSpace: "nowrap",
                            overflow: "hidden"
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                    {group.groupItems.map((item, index) => (
                      <ListItem disablePadding key={index} sx={{ width: (isSp || isMenuOpen) ? "100%" : "fit-content" }}>
                        <ListItemButton
                          onClick={() => router.replace(`${tabBaseUrl}${item.href}`)}
                          sx={{
                            ml: 1, mr: 1,
                            borderRadius: "0.5rem",
                            boxShadow: tabValue === item.href ? "inset 0 0 0 0.125rem var(--primary-color)" : "none",
                            color: tabValue === item.href ? "var(--primary-color)" : "var(--foreground)",
                            height: "3rem"
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: (isSp || isMenuOpen) ? "3rem" : "fit-content",
                              color: tabValue === item.href ? "var(--primary-color)" : "var(--foreground)"
                            }}
                          >
                            {item.icon}
                          </ListItemIcon>
                          {(isSp || isMenuOpen) &&
                            <ListItemText
                              primary={item.name}
                              sx={{ whiteSpace: "nowrap", overflow: "hidden" }}
                            />
                          }
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </div>
                ))}
              <div>

              </div>
            </List>
          </div>
          {/* Tab View */}
          <div className={`tab-view ${isMenuOpen ? "open" : "close"}`}>
            {isSp &&
              <Backdrop
                sx={{ backgroundColor: 'rgba(238, 238, 238, 0.7)', zIndex: 1300 }}
                open={isMenuOpen}
                onClick={() => setIsMenuOpen(false)}
              />
            }
            {tabViewerMap[tabValue]}
          </div>
        </div>
      </div>
    </article>
  );
}
