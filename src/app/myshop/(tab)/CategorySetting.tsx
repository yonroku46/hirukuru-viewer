import React, { Suspense, useState, useEffect } from 'react';
import Loading from '@/app/loading';
import MiniButton from '@/components/button/MiniButton';
import SearchInput from '@/components/input/SearchInput';
import Title from '@/components/layout/Title';

import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

interface SettingProps {
  isSp: boolean;
  shop: Shop;
}

function ItemSetting({ isSp, shop }: SettingProps)  {
  const [searchValue, setSearchValue] = useState<string>("");
  const [categories, setCategories] = useState<ItemCategory[]>([]);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [tempCategories, setTempCategories] = useState<ItemCategory[]>([]);

  const handleEditToggle = (isCancel: boolean = false) => {
    if (editMode && !isCancel) {
      setCategories(tempCategories);
    }
    if (isCancel) {
      setTempCategories(categories);
    }
    setEditMode(!editMode);
  };

  const moveCategory = (index: number, direction: 'up' | 'down') => {
    if (!editMode) return;
    setTempCategories((prev) => {
      const newCategories = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newCategories.length) return newCategories;
      [newCategories[index], newCategories[targetIndex]] = [newCategories[targetIndex], newCategories[index]];
      newCategories[index].categoryOrder = index + 1;
      newCategories[targetIndex].categoryOrder = targetIndex + 1;

      return newCategories;
    });
  };

  useEffect(() => {
    const dummyShopId = "d554fe3e-384c-49c3-ba65-d2858ae92ec1";
    const dummyCategories: ItemCategory[] = [
      { categoryId: '2', shopId: dummyShopId, categoryName: '日替わり弁当', categoryOrder: 1 },
      { categoryId: '1', shopId: dummyShopId, categoryName: '特製弁当', categoryOrder: 2 },
      { categoryId: '3', shopId: dummyShopId, categoryName: '定番弁当', categoryOrder: 3 },
    ];
    setCategories(dummyCategories);
    setTempCategories(dummyCategories);
  }, []);

  useEffect(() => {
    console.log(shop);
  }, [shop]);

  useEffect(() => {
    console.log(categories[0]);
    console.log(tempCategories[0]);
  }, [categories, tempCategories]);

  return (
    <Suspense fallback={<Loading circular />}>
      <div className="tab-title">
        <Title
          title="カテゴリー設定"
          count={categories.length}
          countUnit="件"
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
          <MiniButton
            icon={<AddCircleIcon />}
            onClick={() => {}}
            label={isSp ? undefined : "新規追加"}
          />
        </div>
      </div>
      <div className="tab-contents category-setting">
        <div className="category-list-filter">
          <SearchInput
            searchMode
            placeholder="カテゴリ名を検索"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <div className="category-list-wrapper">
          {categories.sort((a, b) => a.categoryOrder - b.categoryOrder).map((category, index) => (
            <div key={index} className="category-info">
              <div className="category-btn-group">
                {editMode && (
                  <>
                    <MiniButton
                      icon={<ArrowUpwardIcon />}
                      onClick={() => moveCategory(index, 'up')}
                      sx={{
                        opacity: index === 0 ? 0.15 : 1,
                        pointerEvents: index === 0 ? 'none' : 'auto',
                        borderRadius: '0.5rem 0 0 0.5rem',
                      }}
                    />
                    <MiniButton
                      icon={<ArrowDownwardIcon />}
                      onClick={() => moveCategory(index, 'down')}
                      sx={{
                        opacity: index === categories.length - 1 ? 0.15 : 1,
                        pointerEvents: index === categories.length - 1 ? 'none' : 'auto',
                        borderRadius: '0 0.5rem 0.5rem 0',
                        marginLeft: '-1px',
                      }}
                    />
                  </>
                )}
              </div>
              <div className="category-order">
                {category.categoryOrder}
              </div>
              <div className="category-name">
                {category.categoryName}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Suspense>
  );
};

export default React.memo(ItemSetting);
