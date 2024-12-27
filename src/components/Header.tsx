"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import HistoryIcon from '@mui/icons-material/History';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import StorefrontIcon from '@mui/icons-material/Storefront';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const menuItems: GroupMenuItem[] = [
  { groupName: "カスタム", groupHref: "/my", groupItems: [
    { name: "マイページ", href: "/my", icon: <PersonOutlineIcon /> },
    { name: "お気に入り", href: "/my/favorite", icon: <FavoriteBorderIcon /> },
    { name: "注文履歴", href: "/my/history", icon: <HistoryIcon /> },
  ]},
  { groupName: "注文", groupHref: "/bento", groupItems: [
    { name: "弁当/店舗検索", href: "/bento/search", icon: <SearchIcon /> },
    { name: "ランキング", href: "/bento/ranking", icon: <TrendingUpIcon /> },
  ]},
  { groupName: "サービス", groupHref: "/service", groupItems: [
    { name: "お問い合わせ", href: "/service/contact", icon: <SupportAgentIcon /> },
    { name: "パートナー登録", href: "/service/partner", icon: <StorefrontIcon /> },
    { name: "利用方法", href: "/service/help", icon: <HelpOutlineIcon /> },
  ]},
];

export default function Header() {
  const currentPath: string = usePathname();
  const [open, setOpen] = useState<boolean>(false);
  const [isTop, setIsTop] = useState<boolean>(false);
  const [address, setAddress] = useState<string | null>(null);

  const router = useRouter();

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const loginHandle = () => () => {
    setOpen(false);
    router.push('/login');
  };

  const handleScroll = () => {
    if (window.scrollY < 5) {
      setIsTop(true);
    } else {
      setIsTop(false);
    }
  };

  const fetchAddress = async () => {
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
        console.error('GPS情報の取得に失敗しました。');
      }
    );
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  useEffect(() => {
    // スクロールイベント
    window.addEventListener('scroll', handleScroll);
    // リダイレクトパス保存
    if (!currentPath.startsWith('/login')) {
      sessionStorage.setItem('redirect', currentPath);
    }
    // 移動時メニューバーを閉じる
    setOpen(false);
    // スクロールイベントクリーンアップ
    return () => {
      if (currentPath === '') {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, [currentPath, window]);

  return (
    <header className={isTop ? "top" : ""}>
      <div className="main-header container">
        <Drawer anchor="right" PaperProps={{ sx: { borderRadius: "4px 0 0 4px" } }} open={open} onClose={toggleDrawer(false)}>
          <Box sx={{ width: 250 }} role="presentation">
            <List sx={{ p: 0 }}>
              <Box sx={{ p: "1rem"}}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={loginHandle()}
                >
                  <ListItemText primary="ログイン" />
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
                        <ListItemIcon>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.name} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </div>
              ))}
            </List>
          </Box>
        </Drawer>
        <div className="left-container">
          <Link href="/" className="logo">
            {config.service.name}
          </Link>
        </div>
        <div className="right-container">
          <div className={`location ${address ? "active" : ""}`}>
            <FmdGoodOutlinedIcon className="icon" />
            {address || "取得中..."}
          </div>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            className="menu-icon"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
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
