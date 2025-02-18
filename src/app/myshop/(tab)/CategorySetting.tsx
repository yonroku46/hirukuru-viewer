import React, { Suspense, useState, useEffect } from 'react';
import Loading from '@/app/loading';
import MiniButton from '@/components/button/MiniButton';
import SearchInput from '@/components/input/SearchInput';
import Title from '@/components/layout/Title';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';

const MAX_CATEGORY_NAME_LENGTH = 100;

interface SettingProps {
  isSp: boolean;
  shop: Shop;
}

interface SortableCategoryProps {
  editMode: boolean;
  category: ItemCategory;
}

function SortableCategory({ editMode, category }: SortableCategoryProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: category.categoryId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [categoryName, setCategoryName] = useState<string>(category.categoryName);

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="category-info">
        <span className="category-order" {...(editMode ? listeners : {})} style={{ touchAction: 'none', cursor: editMode ? 'grab' : 'default' }}>
          {category.categoryOrder}
        </span>
        <div className="category-name">
          {editMode ? (
            <div className="category-name-input-wrapper">
              <input
                className="category-name-input"
                value={categoryName}
                placeholder="カテゴリ名を入力"
                onChange={(e) => setCategoryName(e.target.value)}
              />
              <div className={`category-name-input-length ${categoryName.length > MAX_CATEGORY_NAME_LENGTH || categoryName.length === 0 ? 'error' : ''}`}>
                {`${categoryName.length} / ${MAX_CATEGORY_NAME_LENGTH}`}
              </div>
            </div>
          ) : (
            <span>
              {categoryName}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function ItemSetting({ isSp, shop }: SettingProps)  {
  const [searchValue, setSearchValue] = useState<string>("");
  const [categories, setCategories] = useState<ItemCategory[]>([]);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [tempCategories, setTempCategories] = useState<ItemCategory[]>([]);

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleSave = () => {
    setCategories(tempCategories);
    setEditMode(false);
  };

  const handleCancel = () => {
    setTempCategories(categories);
    setEditMode(false);
  };

  const handleAddCategory = () => {
    const categoryNumber = tempCategories.length + 1;
    setTempCategories([...tempCategories, {
      categoryId: `new-${categoryNumber}`, shopId: shop.shopId, categoryName: `新規カテゴリー${categoryNumber}`, categoryOrder: categoryNumber
    } as ItemCategory]);
  };

  const onCategoryDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setTempCategories((items) => {
        const oldIndex = items.findIndex((item) => item.categoryId === active.id);
        const newIndex = items.findIndex((item) => item.categoryId === over.id);
        if (oldIndex !== -1 && newIndex !== -1) {
          const newItems = arrayMove(items, oldIndex, newIndex);
          return newItems.map((item, index) => ({
            ...item,
            categoryOrder: index + 1,
          }));
        }
        return items;
      });
    }
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

  return (
    <Suspense fallback={<Loading circular />}>
      <div className="tab-title">
        <Title
          title="カテゴリー設定"
          count={categories.length}
          countUnit="件"
        />
        <div className="edit-btn-group">
          {editMode &&
            <MiniButton
              icon={<LibraryAddIcon />}
              onClick={handleAddCategory}
              label={isSp ? undefined : "新規追加"}
              sx={{ marginRight: '0.5rem' }}
            />
          }
          {editMode && (
            <MiniButton
              icon={<CancelIcon />}
              onClick={handleCancel}
              label={isSp ? undefined : "取り消し"}
            />
          )}
          <MiniButton
            icon={editMode ? <SaveIcon /> : <EditIcon />}
            onClick={editMode ? handleSave : handleEditToggle}
            label={isSp ? undefined : editMode ? '保存' : '編集'}
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
          <DndContext collisionDetection={closestCenter} onDragEnd={onCategoryDragEnd}>
            <SortableContext
              items={tempCategories.map(item => item.categoryId)}
              strategy={verticalListSortingStrategy}
            >
              {tempCategories
                .sort((a, b) => a.categoryOrder - b.categoryOrder)
                .map((category) => (
                  <SortableCategory
                    key={category.categoryId}
                    editMode={editMode}
                    category={category}
                  />
                ))}
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </Suspense>
  );
};

export default React.memo(ItemSetting);
