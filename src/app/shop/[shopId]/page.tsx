"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import dayjs from "dayjs";
import { useSearchParams, useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import UserService from "@/api/service/UserService";
import { currency, formatDaysAgo, formatRating } from "@/common/utils/StringUtils";
import { createKanaSearchRegex } from "@/common/utils/SearchUtils";
import { isBusinessOpen } from "@/common/utils/DateUtils";
import SearchInput from "@/components/input/SearchInput";
import MuiMenu from "@/components/mui/MuiMenu";
import MuiTabs from "@/components/mui/MuiTabs";
import Selector from "@/components/input/Selector";
import ItemCard from "@/components/ItemCard";
import ItemInfoDialog from "@/components/ItemInfoDialog";
import MiniButton from "@/components/button/MiniButton";
import ShopInfoDialog from "@/components/ShopInfoDialog";
import Title from "@/components/layout/Title";

import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Rating from '@mui/material/Rating';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import MarkChatReadOutlinedIcon from '@mui/icons-material/MarkChatReadOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CachedIcon from '@mui/icons-material/Cached';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';

export default function ShopPage(
  { params: { shopId } }: { params: { shopId: string } }
) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get('q');

  const userService = UserService();

  const maxPrice = 2500;
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [reviewFilter, setReviewFilter] = useState<string>('latest');
  const [items, setItems] = useState<ItemState[]>([]);
  const [itemInfoOpen, setItemInfoOpen] = useState<boolean>(false);
  const [shopInfoOpen, setShopInfoOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [reviewList, setReviewList] = useState<ShopReview[]>([]);
  const [priceRange, setPriceRange] = useState<number>(maxPrice);
  const [sort, setSort] = useState<string>('recommend');

  const moreMenuList = [
    [
      { icon: <SupportAgentOutlinedIcon />, text: "お問い合わせ", onClick: () => router.push("/service/contact") },
      { icon: <ContactSupportOutlinedIcon />, text: "店舗ガイド", onClick: () => scrollToGuideSection() },
    ],
    [
      { icon: <ShareOutlinedIcon />, text: "シェア", onClick: () => handleShare() },
    ]
  ]

  const searchFilters: SearchFilter[] = [
    { type: 'select', key: 'sort', label: '並び替え', value: sort, options: [
      { label: 'おすすめ順', value: 'recommend' },
      { label: '評価順', value: 'rating' },
      { label: '高価格順', value: 'expensive' },
      { label: '低価格順', value: 'cheap' },
    ]},
    { type: 'radio', key: 'priceRange', label: '価格帯', value: priceRange.toString(), options: [
      { label: '🪙', repeat: 1, value: '500' },
      { label: '🪙', repeat: 2, value: '1000' },
      { label: '🪙', repeat: 3, value: '1500' },
      { label: '🪙', repeat: 4, value: '2000' },
      { label: '🪙', repeat: 5, value: maxPrice.toString() },
    ]},
  ]

  const handleFilterApply = (updatedFilters: SearchFilter[]) => {
    updatedFilters.forEach(filter => {
      if (filter.key === 'priceRange') {
        setPriceRange(parseInt(filter.value, 10));
      } else if (filter.key === 'sort') {
        setSort(filter.value);
      }
    });
  }

  const shop: Shop = {
    shopId: 'd554fe3e-384c-49c3-ba65-d2858ae92ec1',
    shopName: '唐揚げ壱番屋',
    shopIntro: '揚げ物専門店',
    location: '福岡市博多区',
    detailAddress: '福岡市博多区',
    shopType: 'BENTO',
    servingMinutes: 15,
    profileImg: 'https://i.pinimg.com/236x/71/65/43/716543eb8e6907d7163b55000376e2be.jpg',
    thumbnailImg: 'https://i.pinimg.com/236x/71/65/43/716543eb8e6907d7163b55000376e2be.jpg',
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
  const position: PlacePosition = {
    lat: 33.5902,
    lng: 130.4017
  };

  const shopGuideList = [
    { icon: <ShoppingCartIcon />, title: "ご注文方法", description: "メニューから商品のラインナップを閲覧していただき、お気に入りの商品をカートに入れてご注文いただく事ができます。\n大量注文の場合は「お問い合わせ」ページからご連絡お願いします。" },
    { icon: <CachedIcon />, title: "変更・キャンセル", description: "受け取り予定1日前：16:59まで\n → キャンセル料不要\n受け取り予定1日前：17:00以降\n → ご注文金額の100%のキャンセル料がかかります。" },
    { icon: <CreditCardIcon />, title: "支払方法", description: "現金、クレジットカードがお選びいただけます。" },
    { icon: <MonetizationOnIcon />, title: "ポイント", description: "ログインしてご注文いただくと支払い金額の「1.5%」がポイントとして貯まります。\nポイントはご注文の際にご利用、またはギフト券などに交換できます。\n(※オフラインで購入する場合は会員証のご提示で同じくポイントが貯まります。)" },
  ]

  useEffect(() => {
    if (q) {
      setSearchValue(q);
    }
  }, [q]);

  useEffect(() => {
    console.log(shopId);
    const dummyShopId = "d554fe3e-384c-49c3-ba65-d2858ae92ec1";
    const dummyItems: ItemState[] = [
      { itemId: '1', shopId: dummyShopId, categoryName: '日替わり弁当', itemName: '唐揚げ弁当', itemOrder: 1, itemDescription: "国内産の鶏肉を使用した唐揚げ弁当です。", allergens: "11000000", itemPrice: 2000, discountPrice: 500, ratingAvg: 4.3, stock: 9, thumbnailImg: 'https://i.pinimg.com/736x/f2/67/df/f267dfdd2b0cb8eac4b5e9674aa49e97.jpg', optionMultiple: true, options: [
        { optionId: '1', optionName: 'お茶', optionPrice: 150, optionOrder: 1 },
        { optionId: '2', optionName: 'コーラ', optionPrice: 200, optionOrder: 2 },
        { optionId: '3', optionName: 'メガ盛り', optionPrice: 300, optionOrder: 3 },
      ]},
      { itemId: '2', shopId: dummyShopId, categoryName: '特製弁当', itemName: '他店舗弁当', itemOrder: 2, itemDescription: "特製のり弁です。", allergens: "01010101", itemPrice: 500, discountPrice: 450, ratingAvg: 4.5, thumbnailImg: 'https://i.pinimg.com/736x/d2/bb/52/d2bb52d3639b77f024c8b5a584949644.jpg', optionMultiple: false, options: [
        { optionId: '1', optionName: '特盛', optionPrice: 1000, optionOrder: 1 },
        { optionId: '2', optionName: '大盛', optionPrice: 200, optionOrder: 2 },
        { optionId: '3', optionName: '中盛', optionPrice: 0, optionOrder: 3 },
        { optionId: '4', optionName: '小盛', optionPrice: -100, optionOrder: 4 },
      ]},
      { itemId: '3', shopId: 'fuk002', categoryName: '特製弁当', itemName: 'チキン南蛮弁当', itemOrder: 3, itemPrice: 750, ratingAvg: 3.9, stock: 2, thumbnailImg: 'https://i.pinimg.com/236x/42/d7/59/42d7590255cfd29e56db2b3d968419d4.jpg' },
      { itemId: '4', shopId: dummyShopId, categoryName: '特製弁当', itemName: 'カレー弁当', itemOrder: 4, itemPrice: 550, ratingAvg: undefined, stock: 0,thumbnailImg: 'https://i.pinimg.com/236x/3b/4f/0a/3b4f0a758df2243b72d1d4985cda5437.jpg' },
      { itemId: '5', shopId: dummyShopId, categoryName: '定番弁当', itemName: '塩鮭弁当', itemOrder: 5, itemPrice: 550, ratingAvg: undefined, thumbnailImg: 'https://i.pinimg.com/736x/53/c1/4c/53c14c49208435da8fca89f4dae85cb4.jpg' },
      { itemId: '6', shopId: dummyShopId, categoryName: '定番弁当', itemName: 'ナポリタン', itemOrder: 6, itemPrice: 750, ratingAvg: 3.9, thumbnailImg: 'https://i.pinimg.com/736x/a0/44/3e/a0443eb63b9e4e56d4bdad82079d11be.jpg' },
      { itemId: '7', shopId: dummyShopId, categoryName: '定番弁当', itemName: 'ビビンバ', itemOrder: 7, itemPrice: 500, ratingAvg: 4.5, thumbnailImg: 'https://i.pinimg.com/736x/15/fc/18/15fc1800352f40dc57aba529365dd6dd.jpg' },
      { itemId: '8', shopId: dummyShopId, categoryName: '定番弁当', itemName: '鶏そぼろ丼', itemOrder: 8, itemPrice: 1000, ratingAvg: 4.3, thumbnailImg: 'https://i.pinimg.com/736x/a3/c0/44/a3c0445cb7ce8a623f9420a2aaa8332c.jpg' },
      { itemId: '9', shopId: dummyShopId, categoryName: '定番弁当', itemName: 'ソースカツ弁当', itemOrder: 9, itemPrice: 1000, ratingAvg: 4.3, thumbnailImg: 'https://i.pinimg.com/736x/09/cc/18/09cc18f3ab7aeb70638f33170251bceb.jpg' },
      { itemId: '10', shopId: dummyShopId, categoryName: '定番弁当', itemName: 'カツカレー', itemOrder: 10, itemPrice: 1000, ratingAvg: 4.3, thumbnailImg: 'https://i.pinimg.com/736x/7f/6f/55/7f6f5560ca41e1870c59b18f6f1f2360.jpg' },
    ];
    const dummyReviewList = [
      { reviewId: '1', userId: 'user1', shopId: dummyShopId, userName: "User1", userProfile: "/assets/img/no-user.jpg", userRatingCount: 1120, userRatingAvg: 4.6, reviewRating: 4, reviewContent: "Good!", createTime: "2024-11-29", shopName: "唐揚げ壱番屋" },
      { reviewId: '2', userId: 'user2', shopId: dummyShopId, userName: "User2", userProfile: "/assets/img/no-user.jpg", userRatingCount: 320, userRatingAvg: 4.9, reviewRating: 5, reviewContent: "Nice!", createTime: "2024-12-29", shopName: "唐揚げ壱番屋" },
      { reviewId: '3', userId: 'user3', shopId: dummyShopId, userName: "User3", userProfile: "/assets/img/no-user.jpg", userRatingCount: undefined, userRatingAvg: undefined, reviewRating: 4, reviewContent: "Good!", createTime: "2024-12-28", shopName: "唐揚げ壱番屋" },
      { reviewId: '4', userId: 'user4', shopId: dummyShopId, userName: "User4", userProfile: "/assets/img/no-user.jpg", userRatingCount: undefined, userRatingAvg: undefined, reviewRating: 4, reviewContent: "Good!", createTime: "2025-01-24", shopName: "唐揚げ壱番屋" },
      { reviewId: '5', userId: 'user5', shopId: dummyShopId, userName: "User5", userProfile: "/assets/img/no-user.jpg", userRatingCount: undefined, userRatingAvg: undefined, reviewRating: 4, reviewContent: "Good!", createTime: "2025-01-24", shopName: "唐揚げ壱番屋" },
    ]
    setItems(dummyItems as Item[]);
    setReviewList(dummyReviewList as ShopReview[]);
  }, [shopId]);

  const handleClick = (item: Item) => {
    setSelectedItem(item);
    setItemInfoOpen(true);
  }

  async function handleFavorite() {
    if (isFavorite) {
      await userService.cancelFavorite(shop.shopId).then((res) => {
        if (res?.success) {
          setIsFavorite(false);
        }
      });
    } else {
      await userService.addFavorite(shop.shopId).then((res) => {
        if (res?.success) {
          setIsFavorite(true);
        }
      });
    }
  }

  const tabs = useMemo(() => {
    const noItemsText = "表示する商品がありません";
    const categoryMap = items.reduce((acc, item) => {
      if (item.categoryName) {
        if (!acc[item.categoryName]) {
          acc[item.categoryName] = [];
        }
        acc[item.categoryName].push(item);
      }

      if (item.discountPrice) {
        if (!acc['特価/おすすめ']) {
          acc['特価/おすすめ'] = [];
        }
        acc['特価/おすすめ'].push(item);
      }

      return acc;
    }, {} as Record<string, Item[]>);

    const filterItems = (items: Item[]) => {
      if (!searchValue && !priceRange && !sort) return items;

      const searchRegex = createKanaSearchRegex(searchValue);
      const filteredItems = items.filter(item => {
        const matchesSearch = searchValue ? searchRegex.test(item.itemName) : true;
        const effectivePrice = item.discountPrice ?? item.itemPrice;
        const matchesPrice = priceRange >= maxPrice || effectivePrice <= priceRange;

        return matchesSearch && matchesPrice;
      });

      // ソート
      switch (sort) {
        case 'recommend':
          return filteredItems;
        case 'rating':
          return filteredItems.sort((a, b) => (b.ratingAvg ?? 0) - (a.ratingAvg ?? 0));
        case 'expensive':
          return filteredItems.sort((a, b) => (b.discountPrice ?? b.itemPrice) - (a.discountPrice ?? a.itemPrice));
        case 'cheap':
          return filteredItems.sort((a, b) => (a.discountPrice ?? a.itemPrice) - (b.discountPrice ?? b.itemPrice));
        default:
          return filteredItems;
      }
    };

    const filteredItems = filterItems(items);

    const allTab = {
      label: `全て (${filteredItems.length})`,
      active: filteredItems.length > 0,
      panel: (
        <div className={`shop-item ${filteredItems.length === 0 ? 'non-active' : ''}`}>
          {filteredItems.length === 0 ? (
            <div className="shop-item-body no-items">
              <SearchOffIcon fontSize="large" />
              {noItemsText}
            </div>
          ) : (
            <div className="shop-item-body">
              {filteredItems.map((item) => (
                <ItemCard
                  key={item.itemId}
                  data={item}
                  soldOut={item.stock !== undefined && item.stock === 0}
                  onClick={() => handleClick(item)}
                />
              ))}
            </div>
          )}
        </div>
      )
    };

    const specialTabItems = categoryMap['特価/おすすめ'] || [];
    const filteredSpecialTabItems = filterItems(specialTabItems);

    const specialTab = {
      label: '特価/おすすめ',
      active: filteredSpecialTabItems.length > 0,
      panel: (
        <div className={`shop-item ${filteredSpecialTabItems.length === 0 ? 'non-active' : ''}`}>
          {filteredSpecialTabItems.length === 0 ? (
            <div className="shop-item-body no-items">
              <SearchOffIcon fontSize="large" />
              {noItemsText}
            </div>
          ) : (
            <div className="shop-item-body">
              {filteredSpecialTabItems.map((item) => (
                <ItemCard
                  key={item.itemId}
                  data={item}
                  onClick={() => handleClick(item)}
                />
              ))}
            </div>
          )}
        </div>
      )
    };

    const categoryTabs = Object.entries(categoryMap)
      .filter(([category]) => category !== '特価/おすすめ')
      .map(([category, items]) => {
        const filteredCategoryItems = filterItems(items);

        return {
          label: category,
          active: filteredCategoryItems.length > 0,
          panel: (
            <div className={`shop-item ${filteredCategoryItems.length === 0 ? 'non-active' : ''}`}>
              {filteredCategoryItems.length === 0 ? (
                <div className="shop-item-body no-items">
                  <SearchOffIcon fontSize="large" />
                  {noItemsText}
                </div>
              ) : (
                <div className="shop-item-body">
                  {filteredCategoryItems.map((item) => (
                    <ItemCard
                      key={item.itemId}
                      data={item}
                      onClick={() => handleClick(item)}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        };
      });

    return [allTab, specialTab, ...categoryTabs];
  }, [items, searchValue, priceRange, sort]);

  const reviewFilterOptions = [
    {
      label: "最新順",
      value: "latest"
    },
    {
      label: "良い評価順",
      value: "good"
    },
    {
      label: "悪い評価順",
      value: "worst"
    }
  ]

  const handleMore = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const scrollToReviewSection = () => {
    const reviewSection = document.querySelector('.shop-review-content');
    if (reviewSection) {
      const sectionPadding = 1;
      const headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) + sectionPadding;
      const headerHeightRem = headerHeight * parseFloat(getComputedStyle(document.documentElement).fontSize);
      const offsetPosition = reviewSection.getBoundingClientRect().top + window.scrollY - headerHeightRem;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const scrollToGuideSection = () => {
    const guideSection = document.querySelector('.guide-list');
    if (guideSection) {
      const sectionPadding = 1;
      const headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) + sectionPadding;
      const headerHeightRem = headerHeight * parseFloat(getComputedStyle(document.documentElement).fontSize);
      const offsetPosition = guideSection.getBoundingClientRect().top + window.scrollY - headerHeightRem;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  async function handleShare() {
    try {
      const shareData = {
        title: document.title,
        text: "詳細はこちらをクリック！",
        url: window.location.href,
      };
      await navigator.share(shareData);
    } catch (err) {
      console.error(err);
      // Android WebViewなど対応してない時はURLをクリップボードにコピーする
      navigator.clipboard.writeText(window.location.href);
      enqueueSnackbar('クリップボードにコピーしました！', { variant: 'success' });
    }
  }

  const sortedReviewList = useMemo(() => {
    return reviewList.sort((a, b) => {
      const dateA = dayjs(a.createTime).unix();
      const dateB = dayjs(b.createTime).unix();
      // 最新順
      if (reviewFilter === 'latest') {
        return dateB - dateA;
      }
      // 良い評価順 + 最新順
      if (reviewFilter === 'good') {
        return b.reviewRating - a.reviewRating || dateB - dateA;
      }
      // 悪い評価順 + 最新順
      if (reviewFilter === 'worst') {
        return a.reviewRating - b.reviewRating || dateB - dateA;
      }
      return 0;
    });
  }, [reviewFilter, reviewList]);

  return (
    <article className="shop">
      <ShopInfoDialog
        data={shop}
        position={position}
        open={shopInfoOpen}
        setOpen={setShopInfoOpen}
      />
      <ItemInfoDialog
        shop={shop}
        data={selectedItem}
        open={itemInfoOpen}
        setOpen={setItemInfoOpen}
      />
      {/* Shop Header */}
      <section className="shop-header-wrapper">
        <div className="shop-header container">
          <Image
            className={`profile-img ${isBusinessOpen(shop.businessHours || []) ? "open" : ""}`}
            src={shop.profileImg}
            alt={shop.shopName}
            width={74}
            height={74}
          />
          <div className="shop-action-wrapper">
            <MiniButton
              icon={<FmdGoodOutlinedIcon />}
              onClick={() => setShopInfoOpen(true)}
              gray
            />
            <MiniButton
              icon={isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              onClick={() => handleFavorite()}
              gray
            />
            <MiniButton
              icon={<MoreHorizIcon />}
              onClick={handleMore}
              gray
            />
          </div>
        </div>
        <MuiMenu anchorEl={anchorEl} setAnchorEl={setAnchorEl} menuList={moreMenuList} />
      </section>
      {/* Shop Menu & Items */}
      <section className="shop-body container">
        <div className="shop-info">
          <div className="shop-info-header">
            <h1 className="shop-name">
              {shop.shopName}
            </h1>
            <div className="shop-location">
              {shop.location}
            </div>
          </div>
          <button className="shop-rating" onClick={scrollToReviewSection}>
            <StarRoundedIcon fontSize="small" style={{ color: 'var(--rating-color)' }} />
            {`${formatRating(shop.ratingAvg || 0)} (${currency(shop.reviewCount || 0)})`}
          </button>
        </div>
        <div className="shop-item-search">
          <SearchInput
            searchMode
            placeholder="商品名で検索"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            filters={searchFilters}
            onFilterApply={handleFilterApply}
          />
        </div>
        <MuiTabs tabs={tabs} />
      </section>
      <hr className="container" />
      {/* Review */}
      <section className="shop-review container">
        <div className="shop-review-content">
          {/* Review Summary */}
          <div className="review-summary">
            <h2 className="total-rating">
              <StarRoundedIcon style={{ color: 'var(--rating-color)' }} />
              {`${formatRating(shop.ratingAvg || 0)}`}
              <span className="review-count">
                {`(${currency(shop.reviewCount || 0)}個の評価)`}
              </span>
            </h2>
            <div className="rating-distribution">
              {Array.from({ length: 5 }, (_, index) => {
                const star: string = (5 - index).toString();
                const rating = shop.rating?.[star as keyof typeof shop.rating];
                const percentage = rating ? rating.toFixed(0) : "0";
                return (
                  <div className="rating-bar" key={star}>
                    <span>{star}</span>
                    <div className="bar-background">
                      <div className="bar" style={{ width: `${percentage}%` }} />
                    </div>
                    <span className="percentage">{`${percentage}%`}</span>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Review List */}
          <div className="review-list">
            {sortedReviewList.length > 0 ?
              <>
                <div className="review-filter">
                  <Selector
                    options={reviewFilterOptions}
                    value={reviewFilter}
                    onChange={(e) => setReviewFilter(e.target.value)}
                  />
                </div>
                <ul>
                  {sortedReviewList.map((review, index) => (
                    <li key={index} className="review-item">
                      <div className="review-content">
                        <div className="review-title">
                          <div className="review-user">
                            <Image
                              className="review-profile"
                              src={review.userProfile}
                              alt={review.userName}
                              width={36}
                              height={36}
                            />
                            <div className="review-user-info">
                              <div className="review-user-name-rating">
                                <div className="user-name">
                                  {review.userName}
                                </div>
                                <div className="user-rating">
                                  {`評価 ${currency(review.userRatingCount || 0)} ・ 平均 ${review.userRatingAvg || 0}`}
                                </div>
                              </div>
                              <Rating
                                readOnly
                                size="small"
                                value={review.reviewRating}
                                icon={<StarRoundedIcon fontSize="inherit" style={{ color: 'var(--rating-color)' }} />}
                                emptyIcon={<StarRoundedIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                              />
                            </div>
                          </div>
                          <div className="review-date">
                            {formatDaysAgo(review.createTime)}
                          </div>
                        </div>
                        <p>
                          {review.reviewContent}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
              :
              <div className="no-review">
                <MarkChatReadOutlinedIcon fontSize="large" />
                皆さんの評価をお待ちしております
              </div>
            }
          </div>
        </div>
      </section>
      {/* Shop Guide */}
      <section className="shop-guide">
        <div className="shop-guide-info container">
          <Title
            title="店舗ご利用ガイド"
          />
          <div className="guide-list">
            {shopGuideList.map((guide, index) => (
              <div key={index} className="guide-item">
                <div className="guide-item-title">
                  {guide.icon}
                  {guide.title}
                </div>
                <div className="guide-item-description">
                  {guide.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}