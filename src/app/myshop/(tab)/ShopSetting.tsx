import React, { Suspense, useState, Dispatch, SetStateAction } from 'react';
import Loading from '@/app/loading';
import { formatWeeklyBusinessHours } from '@/common/utils/DateUtils';
import MiniButton from '@/components/button/MiniButton';
import Selector from '@/components/input/Selector';
import Title from '@/components/layout/Title';

import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

interface SettingProps {
  isSp: boolean;
  shop: Shop;
  setShop: Dispatch<SetStateAction<Shop | null>>;
}

function ShopSetting({ isSp, shop, setShop }: SettingProps)  {

  const [editMode, setEditMode] = useState<boolean>(false);
  const [tempShop, setTempShop] = useState<Shop>(shop);
  console.log(shop);

  const locationOptions = [
    { label: '東京都', value: 'tokyo' },
    { label: '大阪府', value: 'osaka' },
    { label: '福岡県', value: 'fukuoka' },
  ];

  const shopInfoItems: { label: string, key: keyof Shop }[] = [
    { label: '店舗名', key: 'shopName' },
    { label: '店舗紹介', key: 'shopIntro' },
    { label: '販売位置', key: 'location' },
    { label: '店舗紹介', key: 'shopIntro' },
    { label: '営業時間', key: 'businessHours' },
    { label: '提供時間', key: 'servingMinutes' },
  ];

  const handleEditToggle = (isCancel: boolean = false) => {
    if (editMode && !isCancel) {
      setShop(tempShop);
    }
    if (isCancel) {
      setTempShop(shop);
    }
    setEditMode(!editMode);
  };

  return (
    <Suspense fallback={<Loading circular />}>
      <div className="tab-title">
        <Title
          title="店舗情報"
        />
        <div className="edit-btn-group">
          {editMode && (
            <MiniButton
              icon={<CancelIcon />}
              onClick={() => handleEditToggle(true)}
              label={isSp ? undefined : "取り消し"}
            />
          )}
          <MiniButton
            icon={editMode ? <SaveIcon /> : <EditIcon />}
            onClick={() => handleEditToggle()}
            label={isSp ? undefined : editMode ? '保存' : '編集'}
          />
        </div>
      </div>
      <div className="tab-contents shop-setting">
        <div className="shop-info-wrapper">
          {shopInfoItems.map(({ label, key }) => (
            <div key={key} className="shop-info-item">
              <label>
                {label}
              </label>
              {editMode && key !== 'shopName' ? (
                key === 'location' ? (
                  <Selector
                    options={locationOptions}
                    value={tempShop[key]}
                    onChange={(e) => setTempShop({ ...tempShop, [key]: e.target.value })}
                  />
                ) : key === 'businessHours' ? (
                  <p>
                    {formatWeeklyBusinessHours(tempShop.businessHours || [])}
                  </p>
                ) : (
                  <input
                    type="text"
                    value={tempShop[key] as string}
                    onChange={(e) => setTempShop({ ...tempShop, [key]: e.target.value })}
                  />
                )
              ) : (
                <p>
                  {key === 'businessHours'
                    ? formatWeeklyBusinessHours(tempShop.businessHours || [])
                    : shop[key] as string}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </Suspense>
  );
};

export default React.memo(ShopSetting);
