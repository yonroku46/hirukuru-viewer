import React, { Suspense, useState, useEffect, SetStateAction, Dispatch, useRef, useCallback } from 'react';
import Loading from '@/app/loading';
import { createKanaSearchRegex } from '@/common/utils/SearchUtils';
import MiniButton from '@/components/button/MiniButton';
import ItemCard from '@/components/ItemCard';
import SearchInput from '@/components/input/SearchInput';
import ViewTitle from '@/components/layout/ViewTitle';
import ItemEditDialog from '@/components/ItemEditDialog';
import ConfirmDialog from '@/components/ConfirmDialog';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, useSortable, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { enqueueSnackbar } from 'notistack';
import PartnerService from '@/api/service/PartnerService';
import { config } from '@/config';

import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import WarningIcon from '@mui/icons-material/Warning';

interface SettingProps {
  isSp: boolean;
  shop: Shop;
}

interface SortableItemProps {
  isSp: boolean;
  editMode: boolean;
  shop: Shop;
  item: Item;
  setItems: Dispatch<SetStateAction<ItemState[]>>;
  categories: ShopCategory[];
}

function SortableItem({ isSp, editMode, item, setItems, categories }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.itemId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [openInfo, setOpenInfo] = useState<boolean>(false);
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);

  const handleItemClick = () => {
    setOpenInfo(true);
  };

  const handleDeleteItem = (itemId: string) => {
    setItems((prevItems) => {
      const updatedItems = prevItems.filter((i) => i.itemId !== itemId);
      return updatedItems.map((item, index) => ({
        ...item,
        itemOrder: index + 1,
      }));
    });
  };

  return (
    <>
      <div ref={setNodeRef} style={{ ...style, position: 'relative' }} {...attributes}>
        <span className="item-order" {...(editMode ? listeners : {})} style={{ touchAction: isSp ? 'none' : 'auto', cursor: editMode ? 'grab' : 'default' }}>
          {item.itemOrder}
        </span>
        {editMode && (
          <span className="delete-icon" onClick={() => setOpenConfirm(true)}>
            <DeleteOutlineOutlinedIcon />
          </span>
        )}
        <ItemCard originView data={item} onClick={handleItemClick} />
      </div>
      <ItemEditDialog
        editMode={editMode}
        data={item}
        categories={categories}
        open={openInfo}
        setOpen={setOpenInfo}
        saveData={(data) => {
          setItems((prevItems) =>
            prevItems.map((i) => i.itemId === data.itemId ? data : i)
          );
        }}
      />
      <ConfirmDialog
        icon={<WarningIcon />}
        title="商品を削除しますか？"
        description={`商品を削除すると、\n紐づく統計データにも反映されます。`}
        open={openConfirm}
        setOpen={setOpenConfirm}
        onConfirm={() => handleDeleteItem(item.itemId)}
        onCancel={() => setOpenConfirm(false)}
      />
    </>
  );
}

function ItemSetting({ isSp, shop }: SettingProps)  {
  const partnerService = PartnerService();

  const [searchValue, setSearchValue] = useState<string>("");
  const [editMode, setEditMode] = useState<boolean>(false);
  const [items, setItems] = useState<ItemState[]>([]);
  const [tempItems, setTempItems] = useState<ItemState[]>([]);
  const [categories, setCategories] = useState<ShopCategory[]>([]);
  const endOfListRef = useRef<HTMLDivElement | null>(null);

  const handleEditToggle = (isCancel: boolean = false) => {
    if (editMode && !isCancel) {
      setItems(tempItems);
    }
    if (isCancel) {
      setTempItems(items);
    }
    setEditMode(!editMode);
  };

  const handleSave = () => {
    // 商品空き項目(カテゴリ名,商品名,商品説明,価格)チェック
    const invalidItems = tempItems.filter(item => !(
      item.categoryId &&
      item.itemName.length > 0 &&
      item.itemDescription && item.itemDescription.length > 0 &&
      item.itemPrice > 0
    ));
    if (invalidItems.length > 0) {
      const targetItems = invalidItems.map(item => item.itemOrder).join('、');
      enqueueSnackbar(`以下の商品に入力の誤りがあります\n${targetItems}番`, { variant: 'error' });
      return;
    }

    const deletedItemIds = items.filter(originalItem =>
      !tempItems.some(tempItem =>
        tempItem.itemId === originalItem.itemId
      )
    ).map(item => item.itemId);

    // 削除されたアイテムがあれば削除後に更新実行
    if (deletedItemIds.length > 0) {
      deleteShopItem(deletedItemIds);
    } else {
      upsertShopItem();
    }
  };

  const handleAddItem = () => {
    const itemNumber = tempItems.length + 1;
    const newItem = {
      itemId: `${config.api.newPrefix}${itemNumber}`,
      shopId: shop.shopId,
      itemName: `新規商品${itemNumber}`,
      itemOrder: itemNumber,
      itemPrice: 0,
      allergens: "00000000",
      categoryId: categories && categories.length > 0 ? categories[0].categoryId : undefined,
      thumbnailImg: "",
      options: [],
      optionMultiple: false,
    } as ItemState;
    setTempItems((prevItems) => [...prevItems, newItem]);
    setTimeout(() => {
      endOfListRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  };

  const onItemDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const activeIndex = tempItems.findIndex((item) => item.itemId === active.id);
      const overIndex = tempItems.findIndex((item) => item.itemId === over.id);

      const updatedItems = [...tempItems];
      const [movedItem] = updatedItems.splice(activeIndex, 1);
      updatedItems.splice(overIndex, 0, movedItem);

      const reorderedItems = updatedItems.map((item, index) => {
        return {
          ...item,
          itemOrder: index + 1,
        };
      });
      setTempItems(reorderedItems);
    }
  };

  const getShopCategories = useCallback(() => {
    partnerService.getShopCategories().then((res) => {
      if (res?.list) {
        setCategories(res.list);
      }
    });
  }, [partnerService]);

  const getShopItem = useCallback(() => {
    partnerService.getShopItem().then((res) => {
      if (res?.list) {
        setItems(res.list);
      }
    });
  }, [partnerService]);

  const upsertShopItem = useCallback(() => {
    partnerService.upsertShopItem(tempItems).then((res) => {
      if (res?.success) {
        getShopItem();
        setEditMode(false);
        enqueueSnackbar("保存しました", { variant: 'success' });
      } else {
        enqueueSnackbar("保存に失敗しました", { variant: 'error' });
      }
    });
  }, [partnerService, getShopItem]);

  const deleteShopItem = useCallback((ids: string[]) => {
    partnerService.deleteShopItem(ids).then((res) => {
      if (res?.success) {
        upsertShopItem();
      } else {
        enqueueSnackbar("削除に失敗しました", { variant: 'error' });
      }
    });
  }, [partnerService, upsertShopItem]);

  useEffect(() => {
    getShopCategories();
    getShopItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (items.length > 0) {
      setTempItems(items);
    }
  }, [items]);

  useEffect(() => {
    if (editMode) return;
    if (searchValue) {
      const searchRegex = createKanaSearchRegex(searchValue);
      setTempItems(items.filter((item) => searchRegex.test(item.itemName)));
    } else {
      setTempItems(items);
    }
  }, [searchValue, editMode, items]);

  useEffect(() => {
    if (editMode) {
      setSearchValue("");
      setTempItems(items);
    }
  }, [editMode, items]);

  return (
    <Suspense fallback={<Loading circular />}>
      <div className="tab-contents item-setting">
        <div className="tab-title">
          <ViewTitle
            title={`商品一覧 / ${items.length}件`}
            description="商品設定"
          />
          <div className="edit-btn-group">
            {editMode &&
              <MiniButton
                icon={<LibraryAddIcon />}
                onClick={handleAddItem}
                label={isSp ? undefined : "新規追加"}
                sx={{ marginRight: '0.5rem' }}
              />
            }
            {editMode && (
              <MiniButton
                icon={<CancelIcon />}
                onClick={() => handleEditToggle(true)}
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
        <div className="item-list-filter">
          <SearchInput
            searchMode
            placeholder="商品名を検索"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            disabled={editMode}
          />
        </div>
        <div className="item-list-wrapper">
          <DndContext collisionDetection={closestCenter} onDragEnd={onItemDragEnd}>
            <SortableContext
              items={tempItems.map(item => item.itemId)}
              strategy={rectSortingStrategy}
            >
              {tempItems.length > 0 ?
                <div className="item-list">
                  {tempItems
                    .sort((a, b) => a.itemOrder - b.itemOrder)
                    .map((item) => (
                      <SortableItem
                        key={item.itemId}
                        isSp={isSp}
                        editMode={editMode}
                        shop={shop}
                        item={item}
                        setItems={setTempItems}
                        categories={categories}
                      />
                  ))}
                  <div ref={endOfListRef} />
                </div>
                :
                <div className="item-list no-items">
                  <SearchOffIcon fontSize="large" />
                  <p>表示する商品がありません</p>
                </div>
              }
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </Suspense>
  );
};

export default React.memo(ItemSetting);
