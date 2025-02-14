import React, { Suspense, useState, useEffect } from 'react';
import Loading from '@/app/loading';
import MiniButton from '@/components/button/MiniButton';
import ItemCard from '@/components/ItemCard';
import SearchInput from '@/components/input/SearchInput';
import Title from '@/components/layout/Title';

import AddCircleIcon from '@mui/icons-material/AddCircle';

interface SettingProps {
  isSp: boolean;
  shop: Shop;
}

function ItemSetting({ isSp, shop }: SettingProps)  {

  const [searchValue, setSearchValue] = useState<string>("");
  const [items, setItems] = useState<ItemState[]>([]);
  const [groupedItems, setGroupedItems] = useState<Record<string, ItemState[]>>({});

  const handleItemClick = (item: Item) => {
    console.log(item);
  };

  useEffect(() => {
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
    setItems(dummyItems as Item[]);
  }, []);

  useEffect(() => {
    console.log(shop);
  }, [shop]);

  useEffect(() => {
    const grouped = items.reduce((acc, item) => {
      const category = item.categoryName || '未分類';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as Record<string, Item[]>);

    setGroupedItems(grouped);
  }, [items]);

  return (
    <Suspense fallback={<Loading circular />}>
      <div className="tab-title">
        <Title
          title="商品設定"
          count={items.length}
          countUnit="件"
        />
        <div className="edit-btn-group">
          <MiniButton
            icon={<AddCircleIcon />}
            onClick={() => {}}
            label={isSp ? undefined : "新規追加"}
          />
        </div>
      </div>
      <div className="tab-contents item-setting">
        <div className="item-list-filter">
          <SearchInput
            searchMode
            placeholder="商品名を検索"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <div className="item-list-wrapper">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category} className="category-group">
              <h3 className="category-title">{category}</h3>
              <div className="item-list">
                {items.sort((a, b) => a.itemOrder - b.itemOrder).map((item, index) => (
                  <ItemCard
                    key={index}
                    data={item}
                    onClick={() => handleItemClick(item)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Suspense>
  );
};

export default React.memo(ItemSetting);
