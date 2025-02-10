"use client";

import { useState, useEffect } from "react";
import UserService from "@/api/service/UserService";
import { createKanaSearchRegex } from "@/common/utils/SearchUtils";
import { isBusinessOpen } from "@/common/utils/DateUtils";
import SearchInput from "@/components/input/SearchInput";
import MuiBreadcrumbs from "@/components/mui/MuiBreadcrumbs";
import ShopCard from "@/components/ShopCard";
import SwitchButton from "@/components/button/SwitchButton";

import SearchOffIcon from '@mui/icons-material/SearchOff';

export default function FavoritePage() {
  const breadcrumbs: Breadcrumb[] = [
    { label: 'マイページ', href: '/my' },
    { label: 'お気に入り', href: '/my/favorite', active: true },
  ];

  const userService = UserService();

  const [searchValue, setSearchValue] = useState<string>("");
  const [openOnly, setOpenOnly] = useState<boolean>(false);
  const [favoriteShops, setFavoriteShops] = useState<Shop[]>([]);
  const [filteredShops, setFilteredShops] = useState<(Shop)[]>([]);

  async function handleFavorite(e: React.MouseEvent<HTMLButtonElement>, shopId: string) {
    e.preventDefault();
    if (favoriteShops.find(shop => shop.shopId === shopId)) {
      await userService.cancelFavorite(shopId).then((res) => {
        if (res?.success) {
          setFavoriteShops(favoriteShops.filter(shop => shop.shopId !== shopId));
        }
      });
    }
  }

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
    setFavoriteShops(dummyShops);
    setFilteredShops(dummyShops);
  }, []);

  useEffect(() => {
    const searchRegex = createKanaSearchRegex(searchValue);
    setFilteredShops(
      favoriteShops.filter(item => {
        const matchesSearch = searchRegex.test(item.shopName) || searchRegex.test((item as Shop).location);
        const isOpen = isBusinessOpen(item.businessHours || []);
        return matchesSearch && (!openOnly || isOpen);
      })
    );
  }, [searchValue, favoriteShops, openOnly]);

  return (
    <article>
      <div className="my container">
        <MuiBreadcrumbs breadcrumbs={breadcrumbs} />
        <div className="favorite">
          <h2 className="title">
            お気に入りの店舗
            <span className="count">
              {favoriteShops.length}件
            </span>
          </h2>
          <div className="search-wrapper">
            <SwitchButton
              labels={[{ label: "全て", value: "all" }, { label: "営業中", value: "open" }]}
              onChange={(value: string) => {
                setOpenOnly(value === "open");
                setSearchValue('');
              }}
            />
            <SearchInput
              searchMode
              placeholder={`エリア・店舗名で検索`}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
          {filteredShops.length > 0 ? (
            <div className="item-list">
              {filteredShops.map((item, index) => (
                <ShopCard
                  key={index}
                  data={item as Shop}
                  href={`/shop/${item.shopId}`}
                  openNewTab
                  isFavorite={favoriteShops.find(shop => shop.shopId === item.shopId) ? true : false}
                  handleFavorite={(e, id) => handleFavorite(e, id)}
                />
              ))}
            </div>
          ) : (
            <div className="no-items">
              <SearchOffIcon fontSize="large" />
              表示する店舗がありません
            </div>
          )}
        </div>
      </div>
    </article>
  );
}