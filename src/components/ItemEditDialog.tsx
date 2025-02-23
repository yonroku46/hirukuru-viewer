"use client";

import { Fragment, useEffect, useState } from 'react';
import { useMediaQuery } from "react-responsive";
import { allergensList, currency, optionsToString } from '@/common/utils/StringUtils';
import { enqueueSnackbar } from 'notistack';
import Image from "@/components/Image";
import MiniButton from '@/components/button/MiniButton';
import MuiSwitch from '@/components/mui/MuiSwitch';

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
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

interface ItemEditDialogProps {
  editMode: boolean;
  data: Item;
  open: boolean;
  setOpen: (open: boolean) => void;
  saveData: (data: Item) => void;
}

export default function ItemEditDialog({ editMode, data, open, setOpen, saveData }: ItemEditDialogProps) {
  const isSp = useMediaQuery({ query: "(max-width: 1179px)" });

  const [item, setItem] = useState<Item>();
  const [options, setOptions] = useState<ItemOption[]>([]);

  useEffect(() => {
    if (open) {
      setItem(data);
    }
  }, [open, data]);

  const handleClick = () => {
    if (item) {
      saveData(item);
      setOpen(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "thumbnailImg") => {
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
        setItem((prevData: Item | undefined) => prevData ? ({
          ...prevData,
          [type]: reader.result as string,
          imgFile: file
        }) : undefined);
      };
      reader.readAsDataURL(file);
      fileInput.value = '';
    }
  };

  function renderOptionInputs(item: Item, option: ItemOption, index: number) {
    return (
      <div key={index} className="option-item">
        <label className="input-label">項目名/価格</label>
        <input
          className="option-name"
          type="text"
          value={option.optionName}
          placeholder="オプション項目名"
          onChange={(e) => {
            const updatedOptions = item.options ? [...item.options] : [];
            updatedOptions[index] = { ...option, optionName: e.target.value };
            setItem({ ...item, options: updatedOptions });
          }}
        />
        <input
          className="option-price"
          type="number"
          value={option.optionPrice}
          placeholder="0"
          onChange={(e) => {
            const updatedOptions = item.options ? [...item.options] : [];
            updatedOptions[index] = { ...option, optionPrice: parseFloat(e.target.value) };
            setItem({ ...item, options: updatedOptions });
          }}
        />
        <MiniButton
          icon={<DeleteOutlineOutlinedIcon />}
          onClick={() => {
            const updatedOptions = item.options ? [...item.options] : [];
            updatedOptions.splice(index, 1);
            setItem({ ...item, options: updatedOptions });
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
                  icon={<CloudUploadIcon />}
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
          <div className="item-detail-wrapper">
            <div className="item-name-rating">
              {editMode ?
                <>
                  <label className="input-label">商品名</label>
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
                  <label className="input-label">価格</label>
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
                  <label className="input-label">商品説明</label>
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
                  {item.optionMultiple ? (
                    editMode ? (
                      <>
                        {item.options?.map((option, index) => renderOptionInputs(item, option, index))}
                      </>
                    ) : (
                      <FormGroup>
                        {item.options?.map((option, index) => (
                          <FormControlLabel
                            key={index}
                            value={option}
                            control={
                              <Checkbox
                                onChange={(e) => {
                                  setOptions(e.target.checked
                                    ? [...options, option]
                                    : options.filter(o => o.optionId !== option.optionId)
                                  );
                                }}
                              />
                            }
                            label={optionsToString(option)}
                          />
                        ))}
                      </FormGroup>
                    )
                  ) : (
                    editMode ? (
                      <>
                        {item.options?.map((option, index) => renderOptionInputs(item, option, index))}
                      </>
                    ) : (
                      <RadioGroup
                        onChange={(e) => {
                          const selectedOption = item.options?.find(option => option.optionId === e.target.value);
                          if (selectedOption) {
                            setOptions([selectedOption]);
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
                          optionId: `new-${(item.options?.length || 0) + 1}`,
                          optionName: "",
                          optionPrice: 0,
                          optionOrder: (item.options?.length || 0) + 1
                        } as ItemOption]
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