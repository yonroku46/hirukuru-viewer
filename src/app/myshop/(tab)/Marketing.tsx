import React, { Suspense, useEffect, useState } from 'react';
import Loading from '@/app/loading';
import ViewTitle from '@/components/layout/ViewTitle';
import { currency } from '@/common/utils/StringUtils';
// import PartnerService from '@/api/service/PartnerService';
import MiniButton from '@/components/button/MiniButton';
import Image from "@/components/Image";

import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';

interface ActionsStatus {
  itemId: string;
  isDiscontinued: boolean;
  isOutOfStock: boolean;
  isDiscounted: boolean;
  recommendFlg: boolean;
}

interface SettingProps {
  isSp: boolean;
  shop: Shop;
}

function Marketing({ isSp, shop }: SettingProps)  {

  // const partnerService = PartnerService();

  const [editMode, setEditMode] = useState(false);
  const [items, setItems] = useState<ItemState[]>([]);
  const [marketingText, setMarketingText] = useState('');
  const [activeOption, setActiveOption] = useState<ActionsStatus[]>([]);

  useEffect(() => {
    setActiveOption(items.map((item) => ({
      itemId: item.itemId,
      isDiscontinued: false,
      isOutOfStock: false,
      isDiscounted: false,
      recommendFlg: false,
    })));
  }, [items]);

  const actionList = [
    { label: '販売中止', icon: <LockIcon />, onClick: (itemId: string) => {
      setActiveOption(activeOption.map((option) =>
        option.itemId === itemId
          ? { ...option, isDiscontinued: !option.isDiscontinued }
          : option
      ));
      },
    },
    { label: '品切れ', icon: <LockIcon />, onClick: (itemId: string) => {
      setActiveOption(activeOption.map((option) =>
        option.itemId === itemId
          ? { ...option, isOutOfStock: !option.isOutOfStock }
          : option
      ));
      },
    },
    { label: '値下げ', icon: <LockIcon />, onClick: (itemId: string) => {
      setActiveOption(activeOption.map((option) =>
        option.itemId === itemId
          ? { ...option, isDiscounted: !option.isDiscounted }
          : option
      ));
      },
    },
    { label: 'おすすめ', icon: <LockIcon />, onClick: (itemId: string) => {
      setActiveOption(activeOption.map((option) =>
        option.itemId === itemId
          ? { ...option, recommendFlg: !option.recommendFlg }
          : option
      ));
      },
    },
  ];

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const activeItemFlg = (itemId: string): string => {
    const targetItem = activeOption.find((option) => option.itemId === itemId);
    return targetItem && (targetItem.isDiscontinued || targetItem.isOutOfStock || targetItem.isDiscounted || targetItem.recommendFlg) ? "active" : "";
  }

  const activeActionFlg = (itemId: string, label: string): string => {
    const labelToKeyMap: Record<string, keyof ActionsStatus> = {
      '販売中止': 'isDiscontinued',
      '品切れ': 'isOutOfStock',
      '値下げ': 'isDiscounted',
      'おすすめ': 'recommendFlg',
    };
    const key = labelToKeyMap[label];
    const activeFlg = activeOption.find((option) => option.itemId === itemId)?.[key];
    return activeFlg ? "active" : "";
  }

  useEffect(() => {
    console.log(shop);
  }, [shop]);

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
      { itemId: '9', shopId: dummyShopId, itemName: 'ソースカツ弁当', itemOrder: 9, itemPrice: 1000, ratingAvg: 4.3, thumbnailImg: 'https://i.pinimg.com/736x/09/cc/18/09cc18f3ab7aeb70638f33170251bceb.jpg' },
      { itemId: '10', shopId: dummyShopId, itemName: 'カツカレー', itemOrder: 10, itemPrice: 1000, ratingAvg: 4.3, thumbnailImg: 'https://i.pinimg.com/736x/7f/6f/55/7f6f5560ca41e1870c59b18f6f1f2360.jpg' },
    ];
    setItems(dummyItems as Item[]);
  }, []);

  return (
    <Suspense fallback={<Loading circular />}>
      <div className="tab-contents marketing">
        <div className="tab-title">
          <ViewTitle
            title="設定画面"
            description="マーケティング"
          />
          <div className="edit-btn-group">
            <MiniButton
              icon={editMode ? <LockOpenIcon /> : <LockIcon />}
              onClick={handleEditToggle}
              label={isSp ? undefined : editMode ? 'ロック解除' : 'ロック'}
            />
          </div>
        </div>
        <div className="marketing-filter-wrapper">
          <label className="marketing-label">
            宣伝
          </label>
          {editMode ? (
            <textarea
              className="marketing-text input"
              placeholder="宣伝文を入力してください"
              value={marketingText}
              onChange={(e) => setMarketingText(e.target.value)}
            />
          ) : (
            <p className="marketing-text">
              {marketingText}
            </p>
          )}
        </div>
        <div className="marketing-list-wrapper">
          <div className="marketing-list">
            {items.map((item) => (
              <div key={item.itemId} className="marketing-item">
                <div className={`item-info ${activeItemFlg(item.itemId)}`}>
                  <Image
                    className="item-img"
                    src={item.thumbnailImg}
                    alt={item.itemName}
                    width={68}
                    height={68}
                  />
                  <div className="item-info-text">
                    <div className="item-name">{item.itemName}</div>
                    <div>{currency(item.itemPrice, "円")}</div>
                  </div>
                </div>
                <div className="action-group">
                  {actionList.map((action) => (
                    <button
                      key={action.label}
                      className={`action-btn ${editMode ? "edit" : ""} ${activeActionFlg(item.itemId, action.label)}` }
                      onClick={() => action.onClick(item.itemId)}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default React.memo(Marketing);
