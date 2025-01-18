"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import SearchInput from "@/components/input/SearchInput";
import CartDialog from "@/components/CartDialog";
import MiniButton from "@/components/button/MiniButton";
import NoticeDialog from "@/components/NoticeDialog";
import { config } from "@/config";

import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';
import IconButton from "@mui/material/IconButton";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Button from "@mui/material/Button";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ShoppingBasketOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import StorefrontIcon from '@mui/icons-material/Storefront';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import CloseIcon from '@mui/icons-material/Close';
import PlaceIcon from '@mui/icons-material/Place';

const menuItems: GroupMenuItem[] = [
  { groupName: "カスタム", groupHref: "/my", groupItems: [
    { name: "マイページ", href: "/my", icon: <PersonOutlineIcon /> },
    { name: "注文管理", href: "/my/order", icon: <ShoppingBasketOutlinedIcon /> },
  ]},
  { groupName: "注文", groupHref: "/shop", groupItems: [
    { name: "弁当/店舗検索", href: "/shop/search", icon: <SearchIcon /> },
    { name: "ランキング", href: "/shop/ranking", icon: <TrendingUpIcon /> },
  ]},
  { groupName: "サービス", groupHref: "/service", groupItems: [
    { name: "お問い合わせ", href: "/service/contact", icon: <SupportAgentIcon /> },
    { name: "パートナー申請", href: "/service/partner", icon: <StorefrontIcon /> },
    { name: "利用ガイド", href: "/service/help", icon: <HelpOutlineIcon /> },
  ]},
];

export default function Header() {
  const currentPath: string = usePathname();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [noticeOpen, setNoticeOpen] = useState<boolean>(false);
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [isTop, setIsTop] = useState<boolean>(false);
  const [address, setAddress] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");

  const router = useRouter();

  const toggleDrawer = (newOpen: boolean) => () => {
    setMenuOpen(newOpen);
  };

  const loginHandle = () => () => {
    setMenuOpen(false);
    router.push('/login');
  };

  const handleScroll = () => {
    if (window.scrollY < 5) {
      setIsTop(true);
    } else {
      setIsTop(false);
    }
  };

  const fetchAddress = useCallback(async () => {
    // サービスページは位置情報取得しない
    if (currentPath.startsWith("/service/")) {
      return;
    }
    // 位置情報取得不可の場合はエラーを表示
    if (!navigator.geolocation) {
      setAddress('取得失敗');
      console.error('GPSをサポートしていないブラウザです。');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=ja`
          );

          if (!response.ok) {
            throw new Error('住所を取得できませんでした。');
          }

          const data = await response.json();
          const displayName = data.address.city;
          const isJapan = data.address && data.address.country === 'Japan' || data.address.country === '日本';

          setAddress(isJapan ? displayName : '国外');
        } catch (err) {
          console.error((err as Error).message);
        }
      },
      (err) => {
        setAddress('取得失敗');
        if (err.code === err.PERMISSION_DENIED) {
          setNoticeOpen(true);
        } else {
          console.error(err.message);
        }
      }
    );
  }, [currentPath]);

  useEffect(() => {
    // 位置情報取得
    fetchAddress();
  }, [fetchAddress]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // スクロールイベント
    window.addEventListener('scroll', handleScroll);
    // リダイレクトパス保存
    if (!currentPath.startsWith('/login')) {
      sessionStorage.setItem('redirect', currentPath);
    }
    // 移動時メニューバーを閉じてスクロール位置をトップに戻す
    setMenuOpen(false);
    window.scrollTo(0, 0);
    // スクロールイベントクリーンアップ
    return () => {
      if (currentPath === '') {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, [currentPath]);

  return (
    <header className={isTop ? "top" : ""}>
      <div className="main-header container">
        <NoticeDialog
          icon={<PlaceIcon fontSize="large" />}
          title={"位置情報の許可を変更してください"}
          description={`サービス利用には位置情報が必要です。\nブラウザ設定で位置情報をオンにしてください。`}
          href={"/service/help"}
          hrefText={"設定を変更する"}
          open={noticeOpen}
          setOpen={setNoticeOpen}
        />
        <Drawer
          anchor="right"
          PaperProps={{ sx: { borderRadius: "0.5rem 0 0 0.5rem" } }}
          open={menuOpen}
          onClose={toggleDrawer(false)}
        >
          <Box sx={{ width: 280 }} role="presentation">
            <List sx={{ p: 0 }}>
              <MiniButton
                icon={<CloseIcon />}
                onClick={toggleDrawer(false)}
                sx={{
                  display: "flex",
                  marginLeft: "auto",
                  marginTop: "1rem",
                  marginRight: "1rem",
                }}
              />
              <Box sx={{ p: "1rem", fontSize: "0.875rem", display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                ログインが必要です
                <Button
                  variant="contained"
                  onClick={loginHandle()}
                >
                 ログイン
                </Button>
              </Box>
              <Divider />
              {menuItems.map((group) => (
                <div key={group.groupName}>
                  <ListItem disablePadding>
                    <ListItemButton disabled sx={{ opacity: "0.75 !important" }}>
                      <ListItemText primary={group.groupName} />
                    </ListItemButton>
                  </ListItem>
                  {group.groupItems.map((item) => (
                    <ListItem sx={{ pl: 1, pr: 1 }} key={item.name} disablePadding>
                      <ListItemButton href={item.href} onClick={toggleDrawer(false)}>
                        <ListItemIcon sx={{ minWidth: "3rem"}}>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.name} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </div>
              ))}
            </List>
            <div className={`user-location ${address ? "active" : ""}`}>
              <FmdGoodOutlinedIcon className="icon" />
              {address || "取得中..."}
            </div>
          </Box>
        </Drawer>
        <div className="left-container">
          {currentPath === "/search" ? (
            <button onClick={() => router.back()}>
              <KeyboardArrowLeftRoundedIcon />
            </button>
          ) : (
            <Link href="/" className="logo">
              {config.service.name}
            </Link>
          )}
        </div>
        <div className="right-container">
          {currentPath !== "/search" &&
            <CartDialog open={cartOpen} setOpen={setCartOpen} />
          }
          <SearchInput
            searchMode={currentPath === "/search"}
            placeholder={"今食べたいものは？"}
            autoFocus={currentPath === "/search"}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            className="menu-btn"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon className="menu-icon" />
            <Image
              className="user-icon"
              src="/assets/img/no-user.jpg"
              alt="user"
              width={28}
              height={28}
            />
          </IconButton>
        </div>
      </div>
    </header>
  );
};
