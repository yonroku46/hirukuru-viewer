import React, { Suspense, useState, Dispatch, SetStateAction } from 'react';
import { enqueueSnackbar } from 'notistack';
import { dayMap, daysOrder, formatWeeklyBusinessHours } from '@/common/utils/DateUtils';
import Loading from '@/app/loading';
import MiniButton from '@/components/button/MiniButton';
import Selector from '@/components/input/Selector';
import Title from '@/components/layout/Title';
import Image from '@/components/Image';
import TimeInput from '@/components/input/TimeInput';

import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import Checkbox from '@mui/material/Checkbox';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';

interface SettingProps {
  isSp: boolean;
  shop: Shop;
  setShop: Dispatch<SetStateAction<Shop | null>>;
}

function ShopSetting({ isSp, shop, setShop }: SettingProps)  {

  const [editMode, setEditMode] = useState<boolean>(false);
  const [tempShop, setTempShop] = useState<Shop>(shop);

  const locationOptions = [
    { label: '福岡市博多区', value: '福岡市博多区' },
    { label: '福岡市中央区', value: '福岡市中央区' },
    { label: '福岡市東区', value: '福岡市東区' },
    { label: '福岡市西区', value: '福岡市西区' },
    { label: '福岡市南区', value: '福岡市南区' },
    { label: '福岡市城南区', value: '福岡市城南区' },
    { label: '福岡市早良区', value: '福岡市早良区' },
    { label: 'その他', value: 'その他' },
  ];

  const shopInfoItems: { label: string, key: keyof Shop, unit?: string, min?: number, max?: number }[] = [
    { label: '店舗名', key: 'shopName' },
    { label: '店舗紹介', key: 'shopIntro' },
    { label: '販売位置', key: 'location' },
    { label: '詳細住所', key: 'detailAddress' },
    { label: '営業時間', key: 'businessHours' },
    { label: '平均提供時間', key: 'servingMinutes', unit: '分', min: 0, max: 30 },
  ];

  const handleBusinessDayChange = (day: DayType['type'], isOpen: boolean) => {
    const updatedHours = tempShop.businessHours?.map((hour) => {
      if (hour.dayOfWeek === day) {
        return { ...hour, businessDay: isOpen };
      }
      return hour;
    }) || [];

    if (!updatedHours.some(hour => hour.dayOfWeek === day)) {
      updatedHours.push({
        dayOfWeek: day,
        businessDay: isOpen,
        openTime: '',
        closeTime: ''
      });
    }

    setTempShop({ ...tempShop, businessHours: updatedHours as BusinessHour[] });
  };

  const handleBusinessHoursChange = (dayIndex: number, isOpen: boolean, startTime?: string, endTime?: string) => {
    const updatedHours = tempShop.businessHours?.map((hour, index) => {
      if (index === dayIndex) {
        return { ...hour, businessDay: isOpen, openTime: startTime || hour.openTime, closeTime: endTime || hour.closeTime };
      }
      return hour;
    }) || [];

    setTempShop({ ...tempShop, businessHours: updatedHours as BusinessHour[] });
  };

  const handleEditToggle = (isCancel: boolean = false) => {
    if (editMode && !isCancel) {
      setShop(tempShop);
    }
    if (isCancel) {
      setTempShop(shop);
    }
    setEditMode(!editMode);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "thumbnailImg" | "profileImg") => {
    const fileInput = e.target;
    const file = fileInput.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        enqueueSnackbar("画像ファイルを選択してください", { variant: 'warning' });
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB
        enqueueSnackbar("5MB以上の画像はアップロードできません", { variant: 'warning' });
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setTempShop((prevData: Shop) => ({
          ...prevData,
          [type]: reader.result,
          imgFile: file
        }));
      };
      reader.readAsDataURL(file);
      fileInput.value = '';
    }
  };

  return (
    <Suspense fallback={<Loading circular />}>
      <div className="tab-contents shop-setting">
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
        <div className="shop-info-container">
          <div className="shop-info-img-wrapper">
            <label>
              プロフィール
            </label>
            <div className={`thumbnail-img ${editMode ? 'edit' : ''}`}>
              <Image
                src={editMode ? tempShop.thumbnailImg : shop.thumbnailImg}
                alt={shop.shopName}
                width={350}
                height={220}
              />
              {editMode && (
                <>
                  <MiniButton
                    className="edit-btn"
                    icon={<PhotoLibraryIcon />}
                    onClick={() => document.getElementById('thumbnail-upload')?.click()}
                  />
                  <input
                    type="file"
                    id="thumbnail-upload"
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'thumbnailImg')}
                  />
                </>
              )}
            </div>
            <div className={`profile-img ${editMode ? 'edit' : ''}`}>
              <Image
                src={editMode ? tempShop.profileImg : shop.profileImg}
                alt={shop.shopName}
                width={80}
                height={80}
              />
              {editMode && (
                <>
                  <MiniButton
                    className="edit-btn"
                    icon={<PhotoLibraryIcon />}
                    onClick={() => document.getElementById('profile-upload')?.click()}
                  />
                  <input
                    type="file"
                    id="profile-upload"
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'profileImg')}
                  />
                </>
              )}
            </div>
          </div>
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
                    <div className="business-hours-wrapper">
                      {daysOrder.map((day, index) => {
                        const dayHours: BusinessHour = tempShop.businessHours?.find((hour) => hour.dayOfWeek === day) || {} as BusinessHour;
                        return (
                          <div key={day} className="business-hours-item">
                            <Checkbox
                              checked={dayHours.businessDay}
                              onChange={(e) => handleBusinessDayChange(day, e.target.checked)}
                              sx={{ p: 0 }}
                            />
                            <div className="business-hours-item-day">
                              {dayMap[day]}
                            </div>
                            <TimeInput
                              className='business-hours-time-input'
                              value={dayHours.openTime || ''}
                              setValue={(value) => handleBusinessHoursChange(index, true, value as string, dayHours.closeTime || '')}
                              placeholder="開始時間"
                              disabled={!dayHours.businessDay}
                              style={{ maxWidth: '200px' }}
                            />
                            <TimeInput
                              className='business-hours-time-input'
                              value={dayHours.closeTime || ''}
                              setValue={(value) => handleBusinessHoursChange(index, true, dayHours.openTime || '', value as string)}
                              placeholder="終了時間"
                              disabled={!dayHours.businessDay}
                              style={{ maxWidth: '200px' }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  ) : key === 'servingMinutes' ? (
                    (() => {
                      const min = shopInfoItems.find((item) => item.key === key)?.min || 0;
                      const max = shopInfoItems.find((item) => item.key === key)?.max || 60;
                      return (
                        <div className='serving-minutes-wrapper'>
                          <input
                            type="text"
                            value={tempShop[key] as number}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              if (!value) {
                                setTempShop({ ...tempShop, [key]: 0 });
                              } else if (value > max) {
                                setTempShop({ ...tempShop, [key]: max });
                              } else if (value >= min) {
                                setTempShop({ ...tempShop, [key]: value });
                              }
                            }}
                            placeholder={`${min} ~ ${max}以内`}
                            min={min}
                            max={max}
                          />
                          <span className='unit'>
                            {shopInfoItems.find((item) => item.key === key)?.unit}
                          </span>
                        </div>
                      );
                    })()
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
                      : shop[key] as string
                    }
                    {shopInfoItems.find((item) => item.key === key)?.unit && (
                      <span className='unit'>
                        {shopInfoItems.find((item) => item.key === key)?.unit}
                      </span>
                    )}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default React.memo(ShopSetting);
