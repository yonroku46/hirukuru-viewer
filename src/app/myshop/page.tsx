"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMediaQuery } from "react-responsive";
import { useAppSelector } from "@/store";
import Image from "@/components/Image";
import Dashboard from "./(tab)/Dashboard";
import ShopSetting from "./(tab)/ShopSetting";
import ItemSetting from "./(tab)/ItemSetting";
import CategorySetting from "./(tab)/CategorySetting";
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
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import Backdrop from "@mui/material/Backdrop";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export default function MyShopPage() {
  const isSp = useMediaQuery({ query: "(max-width: 1179px)" });
  const router = useRouter();
  const searchParams = useSearchParams();
  const authState = useAppSelector((state) => state.auth);

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
      { name: "注文履歴", href: "orders", icon: <ManageSearchIcon /> },
    ]},
    { groupName: "サービス", groupHref: "service", groupItems: [
      { name: "精算管理", href: "settlement", icon: <PointOfSaleIcon /> },
      { name: "利用ガイド", href: "help", icon: <ContactSupportIcon /> },
    ]},
  ];

  const tab = searchParams.get('tab');
  const tabBaseUrl = `/myshop?tab=`;
  const initialTab = menuItems[0].groupItems[0].href;
  const [tabValue, setTabValue] = useState<string>(tab || initialTab);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [shop, setShop] = useState<Shop | null>(null);

  // const getShopInfo = useCallback(() => {
  //   userService.userInfo().then((shop) => {
  //     if (shop) {
  //       setShop(shop);
  //     }
  //   });
  // }, [userService]);

  // useEffect(() => {
  //   if (!authState.hasLogin) {
  //     router.replace('/login');
  //     return;
  //   } else if (!shop) {
  //     getShopInfo();
  //   }
  // }, [shop, router, authState.hasLogin, getShopInfo]);

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

  if (!shop) return null;

  const tabViewerMap: { [key: string]: JSX.Element } = {
    "dashboard": <Dashboard shop={shop} />,
    "shop": <ShopSetting isSp={isSp} shop={shop} setShop={setShop} />,
    "item": <ItemSetting isSp={isSp} shop={shop} />,
    "category": <CategorySetting isSp={isSp} shop={shop} />,
  };

  return (
    <article>
      <div className="myshop-page">
        <div className="content-header">
          <div className="shop-info">
            <div className="shop-profile-wrapper">
              {isSp && (
                <button
                  className={`shop-menu-btn ${isMenuOpen ? "open" : ""}`}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <KeyboardArrowDownIcon />
                </button>
              )}
              <Image
                src={shop.profileImg}
                alt={shop.shopName}
                width={40}
                height={40}
              />
              <div className="shop-name-wrapper">
                <p className="shop-location">
                  {shop.location}
                </p>
                <p className="shop-name">
                  {shop.shopName}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="content-body">
          {/* Tab Menu */}
          <div className={`tab-menu ${isSp && isMenuOpen ? "open" : "close"}`}>
              <List sx={{ p: 0 }}>
                {menuItems.map((group) => (
                  <div key={group.groupName}>
                    <ListItem disablePadding>
                      <ListItemButton disabled sx={{ opacity: "0.75 !important" }}>
                        <ListItemText primary={group.groupName} />
                      </ListItemButton>
                    </ListItem>
                    {group.groupItems.map((item, index) => (
                      <ListItem disablePadding key={index}>
                        <ListItemButton
                          onClick={() => router.replace(`${tabBaseUrl}${item.href}`)}
                          sx={{
                            ml: 1, mr: 1,
                            borderRadius: "0.5rem",
                            boxShadow: tabValue === item.href ? "inset 0 0 0 0.125rem var(--primary-color)" : "none",
                            color: tabValue === item.href ? "var(--primary-color)" : "var(--foreground)"
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: "3rem",
                              color: tabValue === item.href ? "var(--primary-color)" : "var(--foreground)"
                            }}
                          >
                            {item.icon}
                          </ListItemIcon>
                          <ListItemText primary={item.name} />
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
          <div className="tab-view">
            <Backdrop
              sx={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', zIndex: 1300 }}
              open={isSp && isMenuOpen}
              onClick={() => setIsMenuOpen(false)}
            />
            {tabViewerMap[tabValue]}
          </div>
        </div>
      </div>
    </article>
  );
}
