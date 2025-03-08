"use client";

import { Fragment, useEffect, useState, useCallback } from 'react';
import { useMediaQuery } from "react-responsive";
import { allergensList, currency, optionsToString } from '@/common/utils/StringUtils';
import { enqueueSnackbar } from 'notistack';
import Image from "@/components/Image";
import MiniButton from '@/components/button/MiniButton';
import MuiSwitch from '@/components/mui/MuiSwitch';
import Selector from '@/components/input/Selector';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { config } from '@/config';
import ImageCropDialog from '@/components/ImageCropDialog';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import EditNoteIcon from '@mui/icons-material/EditNote';
import CloseIcon from "@mui/icons-material/Close";
import Button from '@mui/material/Button';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

interface ItemEditDialogProps {
  editMode: boolean;
  data: Item;
  categories: ShopCategory[];
  open: boolean;
  setOpen: (open: boolean) => void;
  saveData: (data: Item) => void;
}

export default function ItemEditDialog({ editMode, data, categories, open, setOpen, saveData }: ItemEditDialogProps) {
  const isSp = useMediaQuery({ query: "(max-width: 1179px)" });

  const [item, setItem] = useState<Item>();
  const [forTestOptions, setForTestOptions] = useState<ItemOption[]>([]);
  const [cropDialogOpen, setCropDialogOpen] = useState<boolean>(false);
  const [cropImageSrc, setCropImageSrc] = useState<string>('');

  useEffect(() => {
    if (open) {
      setItem(data);
    }
  }, [open, data]);

  const handleClick = () => {
    if (item) {
      // 商品空き項目(カテゴリ名,商品名,商品説明,価格)チェック
      const missingFields = [];
      if (!item.categoryId) {
        missingFields.push('カテゴリー');
      }
      if (item.itemName.length === 0) {
        missingFields.push('商品名');
      }
      if (!item.itemDescription || item.itemDescription.length === 0) {
        missingFields.push('商品説明');
      }
      if (item.itemPrice <= 0) {
        missingFields.push('価格');
      }
      if (!item.options || !item.options.every(opt => opt.optionName.length > 0)) {
        missingFields.push('オプション');
      }

      if (missingFields.length > 0) {
        enqueueSnackbar(`以下の項目を入力してください\n${missingFields.join('、')}`, { variant: 'error' });
        return;
      } else {
        saveData(item);
        setOpen(false);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setCropImageSrc(reader.result as string);
        setCropDialogOpen(true);
      };
      reader.readAsDataURL(file);
      fileInput.value = '';
    }
  };

  const handleImageCrop = (croppedBlob: Blob) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (!item) return;
      setItem({
        ...item,
        thumbnailImg: reader.result as string,
        imgFile: new File([croppedBlob], `${config.api.imgPrefix}${item.itemId}`, { type: croppedBlob.type, lastModified: Date.now() })
      });
    };
    reader.readAsDataURL(croppedBlob);
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = item?.options?.findIndex((opt) =>
        opt.optionId === active.id
      );
      const newIndex = item?.options?.findIndex((opt) =>
        opt.optionId === over.id
      );
      if (oldIndex !== -1 && newIndex !== -1) {
        const newOptions = [...item?.options || []];
        const [movedOption] = newOptions.splice(oldIndex as number, 1);
        newOptions.splice(newIndex as number, 0, movedOption);
        const updatedOptions = newOptions.map((opt, idx) => ({
          ...opt,
          optionOrder: idx + 1
        }));
        if (item) {
          setItem({ ...item as Item, options: updatedOptions });
        }
      }
    }
  };

  function SortableOption({ item, option, index, setItem }: {
    item: Item,
    option: ItemOption,
    index: number,
    setItem: React.Dispatch<React.SetStateAction<Item | undefined>>
  }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: option.optionId });
    const [optionName, setOptionName] = useState<string>(option.optionName);
    const [optionPrice, setOptionPrice] = useState<number>(option.optionPrice);

    useEffect(() => {
      setOptionName(option.optionName);
      setOptionPrice(option.optionPrice);
    }, [option]);

    useEffect(() => {
      if (item && item.options && item.options.length > 0) {
        const currentMultipleFlg = item.optionMultiple || false;
        // オプションがあり、1つでも multipleFlgがcurrentMultipleFlgと異なれば更新
        const needsUpdate = item.options.some(opt => opt.multipleFlg !== currentMultipleFlg);
        if (needsUpdate) {
          setItem(prevItem => {
            if (!prevItem) return prevItem;
            const updatedOptions = prevItem.options ? prevItem.options.map(opt => ({
              ...opt,
              multipleFlg: prevItem.optionMultiple || false
            })) : [];
            return { ...prevItem, options: updatedOptions as ItemOption[] };
          });
        }
      }
    }, [item, setItem]);

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    const handleChange = useCallback((field: 'optionName' | 'optionPrice', value: string | number) => {
      setItem((prevItem) => {
        if (!prevItem) return prevItem;
        const updatedOptions = prevItem.options ? [...prevItem.options] : [];
        updatedOptions[index] = { ...updatedOptions[index], [field]: value };
        return { ...prevItem, options: updatedOptions };
      });
    }, [index, setItem]);

    return (
      <div ref={setNodeRef} style={style} className="option-item">
        <div {...attributes} {...listeners} style={{ display: 'flex', cursor: 'grab' }}>
          <DragIndicatorIcon />
        </div>
        <label className="input-label required">項目名/価格</label>
        <input
          className="option-name"
          type="text"
          value={optionName}
          placeholder="オプション項目名"
          onChange={(e) => setOptionName(e.target.value)}
          onBlur={() => handleChange('optionName', optionName)}
        />
        <input
          className="option-price"
          type="number"
          value={optionPrice}
          placeholder="0"
          onChange={(e) => setOptionPrice(parseInt(e.target.value) || 0)}
          onBlur={() => handleChange('optionPrice', optionPrice)}
        />
        <MiniButton
          icon={<DeleteOutlineOutlinedIcon />}
          onClick={() => {
            const updatedOptions = item.options ? [...item.options] : [];
            const currentOptionId = option.optionId;
            const newOptions = updatedOptions.map(opt =>
              opt.optionId === currentOptionId
                ? { ...opt, optionId: `${config.api.delPrefix}${opt.optionId}` }
                : opt
            );
            setItem({ ...item, options: newOptions });
          }}
        />
      </div>
    );
  }

  if (!item) {
    return null;
  }

  return (
    <Fragment>
      <Dialog
        className={`item-dialog ${editMode ? "edit" : ""}`}
        fullScreen={isSp}
        open={open}
        onClose={() => setOpen(false)}
      >
        <DialogTitle className="title-wrapper">
          <div className="title">
            {editMode ? <EditNoteIcon /> : <ManageSearchOutlinedIcon />}
            {editMode ? "商品編集" : "プレビュー"}
          </div>
          <CloseIcon className="close-icon" onClick={() => setOpen(false)} />
        </DialogTitle>
        <DialogContent className="content">
          <div className="image-wrapper">
            <Image
              src={item.thumbnailImg}
              alt={item.itemName}
              width={280}
              height={160}
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
                  onChange={(e) => handleFileChange(e)}
                />
                <ImageCropDialog
                  open={cropDialogOpen}
                  imageSrc={cropImageSrc}
                  imageType="thumbnailImg"
                  onClose={() => setCropDialogOpen(false)}
                  onCropComplete={handleImageCrop}
                />
              </>
            )}
          </div>
          <div className="item-detail-wrapper">
            {editMode &&
              <div className="required-info">
                (*は必須項目です)
              </div>
            }
            {editMode &&
              <div className="item-category">
                <label className="input-label required">カテゴリー</label>
                <Selector
                  options={categories.map((category) => ({
                    label: category.categoryName,
                    value: category.categoryId
                  }))}
                  placeholder={categories.length === 0 ? "選択できるカテゴリーがありません" : undefined}
                  value={item.categoryId || categories[0]?.categoryId}
                  onChange={(e) => setItem({ ...item, categoryId: e.target.value })}
                />
              </div>
            }
            <div className="item-name-rating">
              {editMode ?
                <>
                  <label className="input-label required">商品名</label>
                  <input
                    className="item-name"
                    value={item.itemName}
                    placeholder="商品名を入力"
                    onChange={(e) => setItem({ ...item, itemName: e.target.value })}
                  />
                </>
              :
                <div className="item-name">
                  {item.itemName}
                </div>
              }
            </div>
            <div className="price-wrapper">
              {editMode ?
                <>
                  <label className="input-label required">価格</label>
                  <input
                    type="number"
                    className="current-price"
                    value={item.itemPrice}
                    placeholder="0"
                    onChange={(e) => setItem({ ...item, itemPrice: parseInt(e.target.value) })}
                  />
                </>
              :
                <p className="current-price">
                  {currency(item.itemPrice)}
                  <span className="unit">円</span>
                </p>
              }
            </div>
            <div className="description-wrapper">
              {(editMode || item.itemDescription) &&
                editMode ?
                <>
                  <label className="input-label required">商品説明</label>
                  <textarea
                    className="description"
                    value={item.itemDescription}
                    placeholder="商品説明を入力"
                    onChange={(e) => setItem({ ...item, itemDescription: e.target.value })}
                  />
                </>
                :
                <p className="description">
                  {item.itemDescription}
                </p>
              }
            </div>
            {(editMode || item.allergens) &&
              <>
                <p className="allergen-title">
                  アレルギー表示
                </p>
                <div className="allergen-list">
                  {allergensList.map((allergen, index) => (
                    <span
                      key={allergen.allergen}
                      className={`allergen ${item.allergens && item.allergens[index] === '1' ? 'active' : ''}`}
                      onClick={() => {
                        if (editMode) {
                          const newAllergens: string[] = item.allergens?.split('') || Array(allergensList.length).fill('0');
                          newAllergens[index] = newAllergens[index] === '1' ? '0' : '1';
                          setItem({ ...item, allergens: newAllergens.join('') });
                        }
                      }}
                    >
                      <Image
                        src={allergen.img}
                        alt={allergen.name}
                        width={isSp ? 26 : 34}
                        height={isSp ? 26 : 34}
                      />
                      <span className="allergen-name">
                        {allergen.name}
                      </span>
                    </span>
                  ))}
                </div>
              </>
            }
            {(editMode || (item.options && item.options.length > 0)) &&
              <div className="option-wrapper">
                <p className="option-title">
                  オプション
                  {editMode ? (
                      <MuiSwitch
                        label={item.optionMultiple ? "複数選択可" : "1つ選択可"}
                        checked={item.optionMultiple || false}
                        onChange={(_, checked) => setItem({ ...item, optionMultiple: checked })}
                      />
                    )
                  :
                    item.optionMultiple && (
                      <span className="option-multiple">
                        {item.optionMultiple ? "複数選択可" : "1つ選択可"}
                      </span>
                    )
                  }
                </p>
                <div className="option-list">
                  {editMode ? (
                    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                      <SortableContext
                        items={item?.options?.map((opt, idx) => opt.optionId || `option-${idx}`) || []}
                        strategy={verticalListSortingStrategy}
                      >
                        {item?.options?.filter((opt) => !opt.optionId.startsWith('del'))
                          .map((option, index) => (
                            <SortableOption
                              key={index}
                              item={item}
                              option={option}
                              index={index}
                              setItem={setItem}
                            />
                          ))
                        }
                      </SortableContext>
                    </DndContext>
                  ) : (
                    item.optionMultiple ? (
                      <FormGroup>
                        {item.options?.map((option, index) => (
                          <FormControlLabel
                            key={index}
                            value={option}
                            control={
                              <Checkbox
                                onChange={(e) => {
                                  setForTestOptions(e.target.checked
                                    ? [...forTestOptions, option]
                                    : forTestOptions.filter(o => o.optionId !== option.optionId)
                                  );
                                }}
                              />
                            }
                            label={optionsToString(option)}
                          />
                        ))}
                      </FormGroup>
                    ) : (
                      <RadioGroup
                        onChange={(e) => {
                          const selectedOption = item.options?.find(option => option.optionId === e.target.value);
                          if (selectedOption) {
                            setForTestOptions([selectedOption]);
                          }
                        }}
                      >
                        {item.options?.map((option, index) => (
                          <FormControlLabel
                            key={index}
                            value={option.optionId}
                            control={<Radio />}
                            label={optionsToString(option)}
                          />
                        ))}
                      </RadioGroup>
                    )
                  )}
                  {editMode && (
                    <button className="add-option-btn" onClick={() => {
                      setItem({
                        ...item, options: [ ...(item.options || []), {
                          optionId: `${config.api.newPrefix}${(item.options?.length || 0) + 1}`,
                          itemId: item.itemId,
                          optionName: "",
                          optionPrice: 0,
                          optionOrder: (item.options?.length || 0) + 1,
                          multipleFlg: item.optionMultiple || false
                        }]
                      });
                    }}>
                      + オプション項目追加
                    </button>
                  )}
                </div>
              </div>
            }
            <div className="actions">
              <div className="actions-group">
                <Button
                  variant="contained"
                  className="confirm-btn"
                  onClick={editMode ? handleClick : () => setOpen(false)}
                >
                  {editMode ? "保存" : "閉じる"}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};