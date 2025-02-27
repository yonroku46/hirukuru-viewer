import React, { Suspense, useState, useEffect, SetStateAction, Dispatch, useRef } from 'react';
import Loading from '@/app/loading';
import { createKanaSearchRegex } from '@/common/utils/SearchUtils';
import MiniButton from '@/components/button/MiniButton';
import SearchInput from '@/components/input/SearchInput';
import ViewTitle from '@/components/layout/ViewTitle';
import ConfirmDialog from '@/components/ConfirmDialog';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import WarningIcon from '@mui/icons-material/Warning';

const MAX_CATEGORY_NAME_LENGTH = 100;

interface SettingProps {
  isSp: boolean;
  shop: Shop;
}

interface SortableCategoryProps {
  isSp: boolean;
  editMode: boolean;
  category: ItemCategory;
  setCategory: Dispatch<SetStateAction<ItemCategory[]>>;
}

function SortableCategory({ isSp, editMode, category, setCategory }: SortableCategoryProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: category.categoryId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [openConfirm, setOpenConfirm] = useState<boolean>(false);

  const categoryName = category.categoryName;
  const setCategoryName = (name: string) => {
    setCategory((prevCategories) =>
      prevCategories.map((c) =>
        c.categoryId === category.categoryId ? { ...c, categoryName: name } : c
      )
    );
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategory((prevCategories) => {
      const updatedCategories = prevCategories.filter((c) => c.categoryId !== categoryId);
      return updatedCategories.map((category, index) => ({
        ...category,
        categoryOrder: index + 1,
      }));
    });
  };

  return (
    <>
      <div ref={setNodeRef} style={style} {...attributes}>
        <div className="category-info">
          <div className="category-name">
            <span className="category-order" {...(editMode ? listeners : {})} style={{ touchAction: isSp ? 'none' : 'auto', cursor: editMode ? 'grab' : 'default' }}>
              {category.categoryOrder}
            </span>
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
              <span className="category-name-text">
                {categoryName}
              </span>
            )}
          </div>
          {editMode &&
            <span className="delete-icon" onClick={() => setOpenConfirm(true)}>
              <DeleteOutlineOutlinedIcon />
            </span>
          }
        </div>
      </div>
      <ConfirmDialog
        icon={<WarningIcon />}
        title="カテゴリーを削除しますか？"
        description={`カテゴリーを削除すると、\n紐づく商品はすべて未分類に変更されます。`}
        open={openConfirm}
        setOpen={setOpenConfirm}
        onConfirm={() => handleDeleteCategory(category.categoryId)}
        onCancel={() => setOpenConfirm(false)}
      />
    </>
  );
}

function ItemSetting({ isSp, shop }: SettingProps)  {
  const [searchValue, setSearchValue] = useState<string>("");
  const [categories, setCategories] = useState<ItemCategory[]>([]);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [tempCategories, setTempCategories] = useState<ItemCategory[]>([]);
  const endOfListRef = useRef<HTMLDivElement | null>(null);

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
    setTimeout(() => {
      endOfListRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  };

  const onCategoryDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setTempCategories((categories) => {
        const oldIndex = categories.findIndex((category) => category.categoryId === active.id);
        const newIndex = categories.findIndex((category) => category.categoryId === over.id);
        if (oldIndex !== -1 && newIndex !== -1) {
          const newCategories = arrayMove(categories, oldIndex, newIndex);
          return newCategories.map((category, index) => ({
            ...category,
            categoryOrder: index + 1,
          }));
        }
        return categories;
      });
    }
  };

  useEffect(() => {
    const dummyCategories: ItemCategory[] = [
      { categoryId: '2', shopId: shop.shopId, categoryName: '日替わり弁当', categoryOrder: 1 },
      { categoryId: '1', shopId: shop.shopId, categoryName: '特製弁当', categoryOrder: 2 },
      { categoryId: '3', shopId: shop.shopId, categoryName: '定番弁当', categoryOrder: 3 },
    ];
    setCategories(dummyCategories);
    setTempCategories(dummyCategories);
  }, [shop]);

  useEffect(() => {
    if (editMode) return;
    if (searchValue) {
      const searchRegex = createKanaSearchRegex(searchValue);
      setTempCategories(categories.filter((category) => searchRegex.test(category.categoryName)));
    } else {
      setTempCategories(categories);
    }
  }, [searchValue, editMode, categories]);

  useEffect(() => {
    if (editMode) {
      setSearchValue("");
      setTempCategories(categories);
    }
  }, [editMode, categories]);

  return (
    <Suspense fallback={<Loading circular />}>
      <div className="tab-contents category-setting">
        <div className="tab-title">
          <ViewTitle
            title={`カテゴリー一覧 / ${categories.length}件`}
            description="カテゴリー設定"
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
        <div className="category-list-filter">
          <SearchInput
            searchMode
            placeholder="カテゴリ名を検索"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            disabled={editMode}
          />
        </div>
        <div className="category-list-wrapper">
          <DndContext collisionDetection={closestCenter} onDragEnd={onCategoryDragEnd}>
            <SortableContext
              items={tempCategories.map(category => category.categoryId)}
              strategy={verticalListSortingStrategy}
            >
              {tempCategories.length > 0 ?
                tempCategories
                  .sort((a, b) => a.categoryOrder - b.categoryOrder)
                  .map((category) => (
                  <SortableCategory
                    key={category.categoryId}
                    isSp={isSp}
                    editMode={editMode}
                    category={category}
                    setCategory={setTempCategories}
                  />
                ))
                :
                <div className="no-items">
                  <SearchOffIcon fontSize="large" />
                  <p>表示するカテゴリがありません</p>
                </div>
              }
              <div ref={endOfListRef} />
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </Suspense>
  );
};

export default React.memo(ItemSetting);
