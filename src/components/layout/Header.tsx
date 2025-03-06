"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from 'next/dynamic';
import { useMediaQuery } from "react-responsive";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "@/components/Image";
import SearchInput from "@/components/input/SearchInput";
import MiniButton from "@/components/button/MiniButton";
import AuthService from "@/api/service/AuthService";
import CartDialog from "@/components/CartDialog";
import { enqueueSnackbar } from "notistack";
import { useAppDispatch, useAppSelector } from "@/store";

import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';
import IconButton from "@mui/material/IconButton";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ShoppingBasketOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocalLibraryOutlinedIcon from '@mui/icons-material/LocalLibraryOutlined';
import InterestsOutlinedIcon from '@mui/icons-material/InterestsOutlined';
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import CloseIcon from '@mui/icons-material/Close';
import PlaceIcon from '@mui/icons-material/Place';
import ExitToAppSharpIcon from '@mui/icons-material/ExitToAppSharp';

const NoticeDialog = dynamic(() => import('@/components/NoticeDialog'), { ssr: false });

const customMenuItems: MenuItem[] = [
  { name: "マイページ", href: "/my", icon: <PersonOutlineIcon /> },
  { name: "お気に入り", href: "/my/favorite", icon: <FavoriteBorderIcon /> },
  { name: "注文管理", href: "/my/order", icon: <ShoppingBasketOutlinedIcon /> },
];
const menuItems: GroupMenuItem[] = [
  { groupName: "注文", groupHref: "/search", groupItems: [
    { name: "店舗検索", href: "/search/map", icon: <SearchIcon /> },
    { name: "ランキング", href: "/search/ranking", icon: <TrendingUpIcon /> },
  ]},
  { groupName: "サービス", groupHref: "/service", groupItems: [
    { name: "サービス紹介", href: "/service", icon: <LocalLibraryOutlinedIcon /> },
    { name: "お問い合わせ", href: "/service/contact", icon: <SupportAgentIcon /> },
    { name: "パートナー申請", href: "/service/partner", icon: <StorefrontIcon /> },
    { name: "お知らせ", href: "/service/notice", icon: <InterestsOutlinedIcon /> },
    { name: "利用ガイド", href: "/service/help", icon: <ContactSupportOutlinedIcon /> },
  ]},
];

export default function Header() {
  const isSp = useMediaQuery({ query: "(max-width: 1179px)" });

  const currentPath: string = usePathname();
  const searchParams = useSearchParams();
  const q = searchParams.get('q');

  const dispatch = useAppDispatch();
  const authService = AuthService(dispatch);

  const authState = useAppSelector((state) => state.auth);

  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [noticeOpen, setNoticeOpen] = useState<boolean>(false);
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [isTop, setIsTop] = useState<boolean>(true);
  const [address, setAddress] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const [user, setUser] = useState<UserState | undefined>(undefined);
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean>(false);

  const router = useRouter();

  const toggleDrawer = (newOpen: boolean) => () => {
    setMenuOpen(newOpen);
  };

  const loginHandle = () => {
    setMenuOpen(false);
    router.push('/login');
  };

  const logoutHandle = async () => {
    setMenuOpen(false);
    await authService.logout(true).then((result) => {
      if (result) {
        router.push('/');
        enqueueSnackbar("ログアウトしました", { variant: "success" });
      }
    });
  };

  const searchHandle = () => {
    if (searchValue !== "") {
      const history = localStorage.getItem("search-history");
      const searchHistory: string[] = history ? JSON.parse(history) : [];

      // 検索履歴に同じ値がある場合は履歴処理しない
      if (!searchHistory.includes(searchValue)) {
        // 履歴が10個を超える場合は最も古い項目を削除
        if (searchHistory.length >= 10) {
          searchHistory.shift();
        }
        // 検索履歴に新しい値を追加
        searchHistory.push(searchValue);
        localStorage.setItem("search-history", JSON.stringify(searchHistory));
      }
      // 検索ページに移動、検索パラメータを更新(検索ページでは戻るボタン対応のためreplaceを使用)
      if (currentPath.startsWith("/search/map")) {
        const t = searchParams.get('t');
        const c = searchParams.get('c');
        const b = searchParams.get('b');
        const s = searchParams.get('s');

        const queryParams: Record<string, string> = {};

        if (searchValue) {
          queryParams.q = searchValue;
        }
        if (t) queryParams.t = t;
        if (c) queryParams.c = c;
        if (b) queryParams.b = b;
        if (s) queryParams.s = s;

        const queryString = Object.entries(queryParams)
          .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
          .join('&');

        const url = `/search/map${queryString ? `?${queryString}` : ''}`;
        router.replace(url);
      } else {
        const url = searchValue
          ? `/search/map?q=${encodeURIComponent(searchValue)}`
          : '/search/map';
        router.push(url);
      }
    }
  };

  const handleScroll = () => {
    if (window.scrollY < 5) {
      setIsTop(true);
    } else {
      setIsTop(false);
    }
  };

  useEffect(() => {
    // 位置情報認証済み、サービスページの場合は位置情報取得しない
    if (hasLocationPermission || currentPath.startsWith("/service/")) {
      return;
    }
    // 位置情報取得不可の場合はエラーを表示
    if (!navigator.geolocation) {
      setAddress('取得失敗');
      console.error('GPSをサポートしていないブラウザです。');
      return;
    }

    // 権限確認
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' })
        .then((permissionStatus) => {
          if (permissionStatus.state === 'granted') {
            setHasLocationPermission(true);
            getLocation();
          }
        });
    }

    const getLocation = () => {
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
            const isJapan = data.address && (data.address.country === 'Japan' || data.address.country === '日本');
            setAddress(isJapan ? displayName : '国外');
            setHasLocationPermission(true);
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
        },
        {
          // キャッシュされた位置情報を最大5分間使用
          maximumAge: 300000,
          // 新しい位置情報要求時の最大10秒待機
          timeout: 10000
        }
      );
    };
    getLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // ログインユーザー取得
    if (authState.hasLogin) {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
    } else {
      setUser(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState.hasLogin]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // スクロールイベント
    window.addEventListener('scroll', handleScroll);
    // リダイレクトパス保存
    if (!currentPath.startsWith('/login') && !currentPath.startsWith('/signup')) {
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

  useEffect(() => {
    // 検索ページ以外は検索バーをクリア
    if (currentPath.startsWith('/search')) {
      setSearchValue(q || "");
    } else {
      setSearchValue("");
    }
  }, [currentPath, q]);

  return (
    <header className={`${isTop ? "top" : ""}`}>
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
          className="main-menu"
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
              {authState.hasLogin && user ?
                <>
                  <div className="menu-top">
                    <Image
                      className="user-profilie"
                      src={user.profileImg || "/assets/img/no-user.jpg"}
                      alt={user.userName}
                      width={50}
                      height={50}

                    />
                    <div className="user-wrapper">
                      <div className="user-name">
                        {user.userName}
                      </div>
                      <div className="logout-btn" onClick={() => logoutHandle()}>
                        ログアウト
                        <ExitToAppSharpIcon fontSize="small" />
                      </div>
                    </div>
                  </div>
                  {customMenuItems.map((item, index) => (
                    <ListItem key={index} disablePadding
                      sx={{
                        pb: index === customMenuItems.length - 1 ? "1.5rem" : 0,
                        borderBottom: index === customMenuItems.length - 1 ? "1px solid var(--gray-alpha-300)" : "none",
                      }}
                    >
                      <ListItemButton
                        href={item.href}
                        onClick={toggleDrawer(false)}
                        sx={{ ml: 1, mr: 1, borderRadius: "0.5rem" }}
                      >
                        <ListItemIcon sx={{ minWidth: "3rem"}}>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.name} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </>
              :
                <div className="menu-top">
                  <button className="login-btn" onClick={() => loginHandle()}>
                    <span>
                      ログイン
                    </span>
                    <span>|</span>
                    <span>
                      会員登録
                    </span>
                  </button>
                </div>
              }
              {menuItems.map((group) => (
                <div key={group.groupName}>
                  <ListItem disablePadding>
                    <ListItemButton disabled sx={{ opacity: "0.75 !important" }}>
                      <ListItemText primary={group.groupName} />
                    </ListItemButton>
                  </ListItem>
                  {group.groupItems.map((item, index) => (
                    <ListItem key={index} disablePadding>
                      <ListItemButton
                        href={item.href}
                        onClick={toggleDrawer(false)}
                        sx={{ ml: 1, mr: 1, borderRadius: "0.5rem" }}
                      >
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
          {currentPath.startsWith("/search") ? (
            !isSp || !isSearchFocused ? (
              <button onClick={() => router.back()}>
                <ArrowBackRoundedIcon sx={{ marginRight: "0.75rem" }} />
              </button>
            ) : null
          ) : (
            <Link href="/" className="logo">
              Hirukuru
            </Link>
          )}
        </div>
        <div className="right-container">
          {!currentPath.startsWith("/search") && !currentPath.startsWith("/myshop") &&
            <CartDialog user={user} open={cartOpen} setOpen={setCartOpen} />
          }
          <SearchInput
            searchMode={currentPath.startsWith("/search")}
            placeholder={"今食べたいものは？"}
            autoFocus={currentPath.startsWith("/search")}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            onKeyDown={searchHandle}
          />
          <IconButton
            color="inherit"
            aria-label="menu"
            className="menu-btn"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon className="menu-icon" />
            <Image
              className="user-icon"
              src={user ? user.profileImg || "/assets/img/no-user.jpg" : "/assets/img/no-user.jpg"}
              alt={user ? user.userName : "user"}
              width={28}
              height={28}
            />
          </IconButton>
        </div>
      </div>
    </header>
  );
};
