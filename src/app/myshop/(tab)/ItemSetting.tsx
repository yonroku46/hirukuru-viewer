import React, { Suspense, useState, useEffect, SetStateAction, Dispatch, useRef } from 'react';
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
}

function SortableItem({ isSp, editMode, item, setItems }: SortableItemProps) {
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
  const [searchValue, setSearchValue] = useState<string>("");
  const [editMode, setEditMode] = useState<boolean>(false);
  const [items, setItems] = useState<ItemState[]>([]);
  const [tempItems, setTempItems] = useState<ItemState[]>([]);
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

  const handleAddItem = () => {
    const itemNumber = tempItems.length + 1;
    const newItem = {
      itemId: `new-${itemNumber}`, shopId: shop.shopId, itemName: `新規商品${itemNumber}`, itemOrder: itemNumber, itemPrice: 0
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

  useEffect(() => {
    const dummyItems: ItemState[] = [
      { itemId: '1', shopId: shop.shopId, categoryName: '日替わり弁当', itemName: '唐揚げ弁当', itemOrder: 1, itemDescription: "国内産の鶏肉を使用した唐揚げ弁当です。", allergens: "11000000", itemPrice: 2000, discountPrice: 500, ratingAvg: 4.3, stock: 9, thumbnailImg: 'https://i.pinimg.com/736x/f2/67/df/f267dfdd2b0cb8eac4b5e9674aa49e97.jpg', optionMultiple: true, options: [
        { optionId: '1', optionName: 'お茶', optionPrice: 150, optionOrder: 1 },
        { optionId: '2', optionName: 'コーラ', optionPrice: 200, optionOrder: 2 },
        { optionId: '3', optionName: 'メガ盛り', optionPrice: 300, optionOrder: 3 },
      ]},
      { itemId: '2', shopId: shop.shopId, categoryName: '特製弁当', itemName: '他店舗弁当', itemOrder: 2, itemDescription: "特製のり弁です。", allergens: "01010101", itemPrice: 500, discountPrice: 450, ratingAvg: 4.5, thumbnailImg: 'https://i.pinimg.com/736x/d2/bb/52/d2bb52d3639b77f024c8b5a584949644.jpg', optionMultiple: false, options: [
        { optionId: '1', optionName: '特盛', optionPrice: 1000, optionOrder: 1 },
        { optionId: '2', optionName: '大盛', optionPrice: 200, optionOrder: 2 },
        { optionId: '3', optionName: '中盛', optionPrice: 0, optionOrder: 3 },
        { optionId: '4', optionName: '小盛', optionPrice: -100, optionOrder: 4 },
      ]},
      { itemId: '3', shopId: shop.shopId, categoryName: '特製弁当', itemName: 'チキン南蛮弁当', itemOrder: 3, itemPrice: 750, ratingAvg: 3.9, stock: 2, thumbnailImg: 'https://i.pinimg.com/236x/42/d7/59/42d7590255cfd29e56db2b3d968419d4.jpg' },
      { itemId: '4', shopId: shop.shopId, categoryName: '特製弁当', itemName: 'カレー弁当', itemOrder: 4, itemPrice: 550, ratingAvg: undefined, stock: 0,thumbnailImg: 'https://i.pinimg.com/236x/3b/4f/0a/3b4f0a758df2243b72d1d4985cda5437.jpg' },
      { itemId: '5', shopId: shop.shopId, categoryName: '定番弁当', itemName: '塩鮭弁当', itemOrder: 5, itemPrice: 550, ratingAvg: undefined, thumbnailImg: 'https://i.pinimg.com/736x/53/c1/4c/53c14c49208435da8fca89f4dae85cb4.jpg' },
      { itemId: '6', shopId: shop.shopId, categoryName: '定番弁当', itemName: 'ナポリタン', itemOrder: 6, itemPrice: 750, ratingAvg: 3.9, thumbnailImg: 'https://i.pinimg.com/736x/a0/44/3e/a0443eb63b9e4e56d4bdad82079d11be.jpg' },
      { itemId: '7', shopId: shop.shopId, categoryName: '定番弁当', itemName: 'ビビンバ', itemOrder: 7, itemPrice: 500, ratingAvg: 4.5, thumbnailImg: 'https://i.pinimg.com/736x/15/fc/18/15fc1800352f40dc57aba529365dd6dd.jpg' },
      { itemId: '8', shopId: shop.shopId, categoryName: '定番弁当', itemName: '鶏そぼろ丼', itemOrder: 8, itemPrice: 1000, ratingAvg: 4.3, thumbnailImg: 'https://i.pinimg.com/736x/a3/c0/44/a3c0445cb7ce8a623f9420a2aaa8332c.jpg' },
      { itemId: '9', shopId: shop.shopId, itemName: 'ソースカツ弁当', itemOrder: 9, itemPrice: 1000, ratingAvg: 4.3, thumbnailImg: 'https://i.pinimg.com/736x/09/cc/18/09cc18f3ab7aeb70638f33170251bceb.jpg' },
      { itemId: '10', shopId: shop.shopId, itemName: 'カツカレー', itemOrder: 10, itemPrice: 1000, ratingAvg: 4.3, thumbnailImg: 'https://i.pinimg.com/736x/7f/6f/55/7f6f5560ca41e1870c59b18f6f1f2360.jpg' },
    ];
    setItems(dummyItems as Item[]);
  }, [shop]);

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
              onClick={() => handleEditToggle()}
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
