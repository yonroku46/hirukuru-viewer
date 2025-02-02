"use client";

import { useState, useEffect } from "react";
import { createKanaSearchRegex } from "@/common/utils/SearchUtils";
import SearchInput from "@/components/input/SearchInput";
import MuiBreadcrumbs from "@/components/mui/MuiBreadcrumbs";
import ShopCard from "@/components/ShopCard";
import FoodCard from "@/components/FoodCard";

import SearchOffIcon from '@mui/icons-material/SearchOff';
import SwitchButton from "@/components/button/SwitchButton";

export default function FavoritePage() {
  const breadcrumbs: Breadcrumb[] = [
    { label: 'マイページ', href: '/my' },
    { label: 'お気に入り', href: '/my/favorite', active: true },
  ];

  const [favoriteType, setFavoriteType] = useState<'shop' | 'food'>('shop');
  const [searchValue, setSearchValue] = useState<string>("");
  const [favoriteShops, setFavoriteShops] = useState<Shop[]>([]);
  const [favoriteFoods, setFavoriteFoods] = useState<Food[]>([]);
  const [filteredItems, setFilteredItems] = useState<(Shop | Food)[]>([]);

  useEffect(() => {
    const dummyShops: Shop[] = [
      { shopId: '1', location: '福岡市博多区', shopName: '唐揚げ壱番屋', description: '揚げ物専門店', type: 'bento', thumbnailImg: 'https://i.pinimg.com/236x/71/65/43/716543eb8e6907d7163b55000376e2be.jpg', ratingAvg: 4.5, businessHours: [
          { day: 'mon', open: '10:00', close: '23:50' },
          { day: 'tue', open: '10:00', close: '23:50' },
          { day: 'wed', open: '10:00', close: '23:50' },
          { day: 'thu', open: '10:00', close: '23:50' },
          { day: 'fri', open: '10:00', close: '23:50' },
          { day: 'sat', open: '10:00', close: '23:50' },
          { day: 'sun', open: '10:00', close: '23:50' },
        ]
      },
      { shopId: '2', location: '福岡市中央区', shopName: 'チキンが一番', description: 'チキン専門店', type: 'bento', thumbnailImg: 'https://i.pinimg.com/736x/d2/bb/52/d2bb52d3639b77f024c8b5a584949644.jpg', ratingAvg: 4.0, businessHours: [
          { day: 'mon', open: '10:00', close: '20:00' },
          { day: 'wed', open: '10:00', close: '20:00' },
        ]
      },
    ];
    const dummyItems: Food[] = [
      { foodId: '1', shopId: 'fuk001', category: '日替わり弁当', name: '唐揚げ弁当', description: "国内産の鶏肉を使用した唐揚げ弁当です。", ingredients: ["唐揚げ", "ほうれん草ナムル", "白ごはん"], price: 2000, discountPrice: 500, rating: 4.3, stock: 9, thumbnailImg: 'https://i.pinimg.com/736x/f2/67/df/f267dfdd2b0cb8eac4b5e9674aa49e97.jpg', optionMultiple: true, options: [
        { optionId: '1', foodId: '1', shopId: 'fuk001', name: 'お茶', price: 150 },
        { optionId: '2', foodId: '1', shopId: 'fuk001', name: 'コーラ', price: 200 },
        { optionId: '11', foodId: '1', shopId: 'fuk001', name: 'メガ盛り', price: 300 },
      ]},
      { foodId: '2', shopId: 'fuk001', category: '特製弁当', name: '特製のり弁', description: "特製のり弁です。", price: 500, discountPrice: 450, rating: 4.5, thumbnailImg: 'https://i.pinimg.com/736x/d2/bb/52/d2bb52d3639b77f024c8b5a584949644.jpg', optionMultiple: false, options: [
        { optionId: '3', foodId: '2', shopId: 'fuk001', name: '特盛', price: 1000 },
        { optionId: '4', foodId: '2', shopId: 'fuk001', name: '大盛', price: 200 },
        { optionId: '5', foodId: '2', shopId: 'fuk001', name: '中盛', price: 0 },
        { optionId: '6', foodId: '2', shopId: 'fuk001', name: '小盛', price: -100 },
      ]},
      { foodId: '3', shopId: 'fuk001', category: '特製弁当', name: 'チキン南蛮弁当', price: 750, rating: 3.9, stock: 2, thumbnailImg: 'https://i.pinimg.com/236x/42/d7/59/42d7590255cfd29e56db2b3d968419d4.jpg' },
      { foodId: '4', shopId: 'fuk001', category: '特製弁当', name: 'カレー弁当', price: 550, rating: undefined, stock: 0,thumbnailImg: 'https://i.pinimg.com/236x/3b/4f/0a/3b4f0a758df2243b72d1d4985cda5437.jpg' },
      { foodId: '5', shopId: 'fuk001', category: '定番弁当', name: '塩鮭弁当', price: 550, rating: undefined, thumbnailImg: 'https://i.pinimg.com/736x/53/c1/4c/53c14c49208435da8fca89f4dae85cb4.jpg' },
    ];
    setFavoriteShops(dummyShops);
    setFavoriteFoods(dummyItems);
    setFilteredItems(dummyShops);
  }, []);

  useEffect(() => {
    const searchRegex = createKanaSearchRegex(searchValue);
    const items = favoriteType === 'shop' ? favoriteShops : favoriteFoods;
    setFilteredItems(
      items.filter(item =>
        searchRegex.test(
          favoriteType === 'shop' ? (item as Shop).shopName : (item as Food).name
        ) ||
        (favoriteType === 'shop' && searchRegex.test((item as Shop).location))
      )
    );
  }, [searchValue, favoriteType, favoriteShops, favoriteFoods]);

  return (
    <article>
      <div className="my container">
        <MuiBreadcrumbs breadcrumbs={breadcrumbs} />
        <div className="favorite">
          <h2 className="title">
            お気に入りの{favoriteType === 'shop' ? '店舗' : '弁当'}
            <span className="count">
              {favoriteType === 'shop' ? favoriteShops.length : favoriteFoods.length}件
            </span>
          </h2>
          <div className="search-wrapper">
            <SwitchButton
              labels={[{ label: "店舗", value: "shop" }, { label: "弁当", value: "food" }]}
              onChange={(value) => {
                setFavoriteType(value as 'shop' | 'food');
                setSearchValue('');
              }}
            />
            <SearchInput
              searchMode
              placeholder={`${favoriteType === 'shop' ? 'エリア・店舗名' : '弁当名'}で検索`}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
          {filteredItems.length > 0 ? (
            <div className={`item-list ${favoriteType === 'shop' ? 'shop' : 'food'}`}>
              {filteredItems.map((item, index) => (
                favoriteType === 'shop' ?
                  <ShopCard
                    key={index}
                    data={item as Shop}
                    href={`/shop/${item.shopId}`}
                    openNewTab
                  />
                :
                  <FoodCard
                    key={index}
                    data={item as Food}
                    href={`/shop/${item.shopId}?q=${(item as Food).name}`}
                    openNewTab
                  />
              ))}
            </div>
          ) : (
            <div className="no-items">
              <SearchOffIcon fontSize="large" />
              表示する{favoriteType === 'shop' ? '店舗' : '弁当'}がありません
            </div>
          )}
        </div>
      </div>
    </article>
  );
}