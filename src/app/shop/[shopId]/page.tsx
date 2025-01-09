"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { toKatakana } from "wanakana";
import SearchInput from "@/components/input/SearchInput";
import { currency, formatDaysAgo } from "@/common/utils/StringUtils";
import MuiMenu from "@/components/mui/MuiMenu";
import MuiTabs from "@/components/mui/MuiTabs";
import Selector from "@/components/input/Selector";
import FoodCard from "@/components/FoodCard";
import FoodInfoDialog from "@/components/FoodInfoDialog";
import MiniButton from "@/components/button/MiniButton";

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';
import Rating from '@mui/material/Rating';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import MarkChatReadOutlinedIcon from '@mui/icons-material/MarkChatReadOutlined';

export default function ShopInfoPage(
  { params: { shopId } }: { params: { shopId: string } }
) {
  const searchParams = useSearchParams();
  const q = searchParams.get('q');

  const [searchValue, setSearchValue] = useState<string>('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [favoriteItems, setFavoriteItems] = useState<string[]>([]);
  const [reviewFilter, setReviewFilter] = useState<string>('latest');
  const [items, setItems] = useState<Food[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Food | null>(null);
  const [reviewList, setReviewList] = useState<ShopReview[]>([]);

  const shopInfo = {
    id: 1,
    name: '唐揚げ壱番屋',
    description: '揚げ物専門店',
    image: 'https://i.pinimg.com/236x/71/65/43/716543eb8e6907d7163b55000376e2be.jpg',
    reviewcount: 1120,
    ratingAvg: 4.5,
    rating: {
      "1": 2,
      "2": 8,
      "3": 10,
      "4": 25,
      "5": 55
    }
  };

  useEffect(() => {
    if (q) {
      setSearchValue(q);
    }
  }, [q]);

  useEffect(() => {
    console.log(shopId);
    const dummyItems = [
      { id: '1', shopId: 'fuk001', category: '日替わり弁当', name: '唐揚げ弁当', description: "国内産の鶏肉を使用した唐揚げ弁当です。", ingredients: ["唐揚げ", "ほうれん草ナムル", "白ごはん"], price: 1000, discountPrice: 950, rating: 4.3, image: 'https://i.pinimg.com/736x/f2/67/df/f267dfdd2b0cb8eac4b5e9674aa49e97.jpg' },
      { id: '2', shopId: 'fuk001', category: '特製弁当', name: '特製のり弁', description: "特製のり弁です。", price: 500, discountPrice: 450, rating: 4.5, image: 'https://i.pinimg.com/736x/d2/bb/52/d2bb52d3639b77f024c8b5a584949644.jpg' },
      { id: '3', shopId: 'fuk001', category: '特製弁当', name: 'チキン南蛮弁当', price: 750, rating: 3.9, image: 'https://i.pinimg.com/236x/42/d7/59/42d7590255cfd29e56db2b3d968419d4.jpg' },
      { id: '4', shopId: 'fuk001', category: '特製弁当', name: 'カレー弁当', price: 550, rating: undefined, image: 'https://i.pinimg.com/236x/3b/4f/0a/3b4f0a758df2243b72d1d4985cda5437.jpg' },
      { id: '5', shopId: 'fuk001', category: '定番弁当', name: '塩鮭弁当', price: 550, rating: undefined, image: 'https://i.pinimg.com/736x/53/c1/4c/53c14c49208435da8fca89f4dae85cb4.jpg' },
      { id: '6', shopId: 'fuk001', category: '定番弁当', name: 'ナポリタン', price: 750, rating: 3.9, image: 'https://i.pinimg.com/736x/a0/44/3e/a0443eb63b9e4e56d4bdad82079d11be.jpg' },
      { id: '7', shopId: 'fuk001', category: '定番弁当', name: 'ビビンバ', price: 500, rating: 4.5, image: 'https://i.pinimg.com/736x/15/fc/18/15fc1800352f40dc57aba529365dd6dd.jpg' },
      { id: '8', shopId: 'fuk001', category: '定番弁当', name: '鶏そぼろ丼', price: 1000, rating: 4.3, image: 'https://i.pinimg.com/736x/a3/c0/44/a3c0445cb7ce8a623f9420a2aaa8332c.jpg' },
      { id: '9', shopId: 'fuk001', category: '定番弁当', name: 'ソースカツ弁当', price: 1000, rating: 4.3, image: 'https://i.pinimg.com/736x/09/cc/18/09cc18f3ab7aeb70638f33170251bceb.jpg' },
      { id: '10', shopId: 'fuk001', category: '定番弁当', name: 'カツカレー', price: 1000, rating: 4.3, image: 'https://i.pinimg.com/736x/7f/6f/55/7f6f5560ca41e1870c59b18f6f1f2360.jpg' },
    ];
    const dummyReviewList = [
      { id: '1', userId: 'user1', shopId: 'fuk001', user: "User1", userProfile: "/assets/img/no-user.jpg", userRatingCount: 1120, userRatingAvg: 4.6, rating: 4, date: "2024-11-29", comment: "Good!" },
      { id: '2', userId: 'user2', shopId: 'fuk001', user: "User2", userProfile: "/assets/img/no-user.jpg", userRatingCount: 320, userRatingAvg: 4.9, rating: 5, date: "2024-12-29", comment: "Nice!" },
      { id: '3', userId: 'user3', shopId: 'fuk001', user: "User3", userProfile: "/assets/img/no-user.jpg", userRatingCount: undefined, userRatingAvg: undefined, rating: 4, date: "2024-12-28", comment: "Good!" },
    ]
    setItems(dummyItems);
    setReviewList(dummyReviewList);
  }, [shopId]);

  const handleFavorite = useCallback((e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    e.stopPropagation();
    if (favoriteItems.includes(id)) {
      setFavoriteItems(favoriteItems.filter((item) => item !== id));
    } else {
      setFavoriteItems([...favoriteItems, id]);
    }
  }, [favoriteItems]);

  const handleClick = (item: Food) => {
    setSelectedItem(item);
    setOpen(true);
  }

  const tabs = useMemo(() => {
    const noItemsText = "表示する商品がありません";
    const categoryMap = items.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);

      if (item.discountPrice) {
        if (!acc['特価/おすすめ']) {
          acc['特価/おすすめ'] = [];
        }
        acc['特価/おすすめ'].push(item);
      }

      return acc;
    }, {} as Record<string, Food[]>);

    const filterItems = (items: Food[]) => {
      if (!searchValue) return items;

      const searchKana = toKatakana(searchValue);
      const searchRegex = new RegExp(searchValue, 'i');

      return items.filter(item =>
        searchRegex.test(item.name) || // ひらがな・漢字 一致
        item.name.includes(searchKana) // カタカナ 一致
      );
    };

    const filteredItems = filterItems(items);

    const allTab = {
      label: '全て',
      active: filteredItems.length > 0,
      panel: (
        <div className={`shop-item ${filteredItems.length === 0 ? 'non-active' : ''}`}>
          <div className="shop-item-header">
            <span className="count">
              {currency(filteredItems.length)}
            </span>
            件の商品
          </div>
          {filteredItems.length === 0 ? (
            <div className="shop-item-body no-items">
              <SearchOffIcon fontSize="large" />
              {noItemsText}
            </div>
          ) : (
            <div className="shop-item-body">
              {filteredItems.map((item) => (
                <FoodCard
                  key={item.id}
                  data={item}
                  onClick={() => handleClick(item)}
                  isFavorite={favoriteItems.includes(item.id)}
                  handleFavorite={handleFavorite}
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
          <div className="shop-item-header">
            <span className="count">
              {currency(filteredSpecialTabItems.length)}
            </span>
            件の商品
          </div>
          {filteredSpecialTabItems.length === 0 ? (
            <div className="shop-item-body no-items">
              <SearchOffIcon fontSize="large" />
              {noItemsText}
            </div>
          ) : (
            <div className="shop-item-body">
              {filteredSpecialTabItems.map((item) => (
                <FoodCard
                  key={item.id}
                  data={item}
                  onClick={() => handleClick(item)}
                  isFavorite={favoriteItems.includes(item.id)}
                  handleFavorite={handleFavorite}
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
              <div className="shop-item-header">
                <span className="count">
                  {currency(filteredCategoryItems.length)}
                </span>
                件の商品
              </div>
              {filteredCategoryItems.length === 0 ? (
                <div className="shop-item-body no-items">
                  <SearchOffIcon fontSize="large" />
                  {noItemsText}
                </div>
              ) : (
                <div className="shop-item-body">
                  {filteredCategoryItems.map((item) => (
                    <FoodCard
                      key={item.id}
                      data={item}
                      onClick={() => handleClick(item)}
                      isFavorite={favoriteItems.includes(item.id)}
                      handleFavorite={handleFavorite}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        };
      });

    return [allTab, specialTab, ...categoryTabs];
  }, [items, favoriteItems, searchValue, handleFavorite]);

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
      const reviewSectionPadding = 1;
      const headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) + reviewSectionPadding;
      const headerHeightRem = headerHeight * parseFloat(getComputedStyle(document.documentElement).fontSize);
      const offsetPosition = reviewSection.getBoundingClientRect().top + window.scrollY - headerHeightRem;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const sortedReviewList = useMemo(() => {
    return reviewList.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      // 最新順
      if (reviewFilter === 'latest') {
        return dateB - dateA;
      }
      // 良い評価順 + 最新順
      if (reviewFilter === 'good') {
        return b.rating - a.rating || dateB - dateA;
      }
      // 悪い評価順 + 最新順
      if (reviewFilter === 'worst') {
        return a.rating - b.rating || dateB - dateA;
      }
      return 0;
    });
  }, [reviewFilter, reviewList]);

  return (
    <article className="shop">
      <FoodInfoDialog
        data={selectedItem}
        open={open}
        setOpen={setOpen}
        isFavorite={selectedItem ? favoriteItems.includes(selectedItem.id) : false}
        handleFavorite={handleFavorite}
      />
      {/* Shop Info */}
      <section className="shop-header">
        <div className="shop-profile container">
          <Image
            className="profile-img"
            src={shopInfo.image}
            alt={shopInfo.name}
            width={74}
            height={74}
          />
          <div className="shop-action-wrapper">
            <MiniButton
              icon={<FmdGoodOutlinedIcon />}
              onClick={() => {}}
              sx={{
                backgroundColor: "var(--gray-alpha-300)",
                color: "var(--background)",
              }}
            />
            <MiniButton
              icon={<FavoriteBorderIcon />}
              onClick={() => {}}
              sx={{
                backgroundColor: "var(--gray-alpha-300)",
                color: "var(--background)",
              }}
            />
            <MiniButton
              icon={<MoreHorizIcon />}
              onClick={handleMore}
              sx={{
                backgroundColor: "var(--gray-alpha-300)",
                color: "var(--background)",
              }}
            />
          </div>
        </div>
        <MuiMenu anchorEl={anchorEl} setAnchorEl={setAnchorEl} />
      </section>
      {/* Shop Menu & Items */}
      <section className="shop-body container">
        <div className="shop-info">
          <div className="shop-info-header">
            <h1 className="shop-name">{shopInfo.name}</h1>
            <h2 className="shop-description">{shopInfo.description}</h2>
          </div>
          <button className="shop-rating" onClick={scrollToReviewSection}>
            <StarRoundedIcon fontSize="small" style={{ color: 'var(--rating-color)' }} />
            {`${shopInfo.ratingAvg || 0} (${currency(shopInfo.reviewcount || 0)})`}
          </button>
        </div>
        <div className="shop-item-search">
          <SearchInput
            searchMode={true}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
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
              {`${shopInfo.ratingAvg || 0}`}
              <span className="review-count">
                {`(${currency(shopInfo.reviewcount || 0)}個の評価)`}
              </span>
            </h2>
            <div className="rating-distribution">
              {Array.from({ length: 5 }, (_, index) => {
                const star: string = (5 - index).toString();
                const rating = shopInfo.rating[star as keyof typeof shopInfo.rating];
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
                    onChange={(e) => setReviewFilter(e.target.value)}
                  />
                </div>
                <ul>
                  {sortedReviewList.map((review) => (
                    <li className="review-item" key={review.id}>
                      <div className="review-content">
                        <div className="review-title">
                          <div className="review-user">
                            <Image
                              className="review-profile"
                              src={review.userProfile}
                              alt={review.user}
                              width={36}
                              height={36}
                            />
                            <div className="review-user-info">
                              <div className="review-user-name-rating">
                                <div className="user-name">
                                  {review.user}
                                </div>
                                <div className="user-rating">
                                  {`評価 ${currency(review.userRatingCount || 0)} ・ 平均 ${review.userRatingAvg || 0}`}
                                </div>
                              </div>
                              <Rating
                                readOnly
                                size="small"
                                value={review.rating}
                                icon={<StarRoundedIcon fontSize="inherit" style={{ color: 'var(--rating-color)' }} />}
                                emptyIcon={<StarRoundedIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                              />
                            </div>
                          </div>
                          <div className="review-date">
                            {formatDaysAgo(review.date)}
                          </div>
                        </div>
                        <p>
                          {review.comment}
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
    </article>
  );
}