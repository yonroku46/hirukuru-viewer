import React, { Suspense, useCallback, useEffect, useState } from 'react';
import Loading from '@/app/loading';
import ViewTitle from '@/components/layout/ViewTitle';
import { currency } from '@/common/utils/StringUtils';
import PartnerService from '@/api/service/PartnerService';
import MiniButton from '@/components/button/MiniButton';
import Image from "@/components/Image";
import SearchInput from '@/components/input/SearchInput';
import { createKanaSearchRegex } from '@/common/utils/SearchUtils';

import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import SearchOffIcon from '@mui/icons-material/SearchOff';

interface ActionsStatus {
  itemId: string;
  isDiscontinued: boolean;
  isOutOfStock: boolean;
  isDiscounted: boolean;
  recommendFlg: boolean;
}

interface SettingProps {
  isSp: boolean;
}

function Marketing({ isSp }: SettingProps)  {
  const partnerService = PartnerService();

  const [searchValue, setSearchValue] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [items, setItems] = useState<ItemState[]>([]);
  const [tempItems, setTempItems] = useState<ItemState[]>([]);
  const [activeOption, setActiveOption] = useState<ActionsStatus[]>([]);

  useEffect(() => {
    if (items.length > 0) {
      setTempItems(items);
    }
  }, [items]);

  useEffect(() => {
    if (searchValue) {
      const searchRegex = createKanaSearchRegex(searchValue);
      setTempItems(items.filter((item) => searchRegex.test(item.itemName)));
    } else {
      setTempItems(items);
    }
  }, [searchValue, editMode, items]);

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

  const getShopItem = useCallback(() => {
    partnerService.getShopItem().then((res) => {
      if (res?.list) {
        setItems(res.list);
      }
    });
  }, [partnerService]);

  useEffect(() => {
    getShopItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
              label={isSp ? undefined : editMode ? 'ロック' : 'ロック解除'}
            />
          </div>
        </div>
        <div className="marketing-filter-wrapper">
          <SearchInput
            searchMode
            placeholder="商品名を検索"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            disabled={editMode}
          />
        </div>
        <div className="marketing-list-wrapper">
          <div className="marketing-list">
            {tempItems.length > 0 ?
              tempItems.map((item) => (
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
              ))
            :
              <div className="marketing-item no-items">
                <SearchOffIcon fontSize="large" />
                <p>表示する商品がありません</p>
              </div>
            }
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default React.memo(Marketing);
