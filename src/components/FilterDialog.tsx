"use client";

import React, { Fragment, useState } from "react";
import { useMediaQuery } from "react-responsive";
import MiniButton from "@/components/button/MiniButton";
import Selector from "@/components/input/Selector";

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from "@mui/icons-material/Close";
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import Button from "@mui/material/Button";

interface FilterDialogProps {
  filters: SearchFilter[];
  onFilterApply: (updatedFilters: SearchFilter[]) => void;
}

export default function FilterDialog({ filters, onFilterApply }: FilterDialogProps) {
  const isSp = useMediaQuery({ query: "(max-width: 1179px)" });

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i)
    .filter(year => year >= 2025)
    .map(year => ({
      label: `${year}年`,
      value: year.toString(),
    })
  );
  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1).map(month => ({
    label: `${month}月`,
    value: month.toString(),
  }));

  const [tempFilters, setTempFilters] = useState<SearchFilter[]>(filters);
  const [open, setOpen] = useState<boolean>(false);

  const handleFilterChange = (key: string, newValue: string) => {
    setTempFilters(prev =>
      prev.map(filter =>
        filter.key === key ? { ...filter, value: newValue } : filter
      )
    );
  };

  const handleFilterApply = () => {
    onFilterApply(Object.values(tempFilters));
    setOpen(false);
  };

  return (
    <Fragment>
      <MiniButton
        icon={<FilterAltOutlinedIcon />}
        onClick={() => setOpen(true)}
      />
      <Dialog
        className="filter-dialog"
        open={open}
        onClose={() => setOpen(false)}
        fullScreen={isSp}
        maxWidth="lg"
      >
        <DialogTitle className="title-wrapper">
          <div className="title">
            <FilterAltOutlinedIcon />
            フィルター
          </div>
          <CloseIcon className="close-icon" onClick={() => setOpen(false)} />
        </DialogTitle>
        <DialogContent className="content">
          {filters.map((item, index) => (
            <div key={index} className="filter-item">
              <label>
                {item.label}
              </label>
              {item.type === "year" && (
                <Selector
                  options={yearOptions}
                  defaultValue={item.value}
                  onChange={(e) => {
                    handleFilterChange(item.key, e.target.value);
                  }}
                />
              )}
              {item.type === "month" && (
                <Selector
                  options={monthOptions}
                  defaultValue={item.value}
                  onChange={(e) => {
                    handleFilterChange(item.key, e.target.value);
                  }}
                />
              )}
              {item.type === "text" && (
                <input type="text" value={item.value} onChange={(e) => handleFilterChange(item.key, e.target.value)} />
              )}
            </div>
          ))}
          <div className="actions">
            <Button variant="outlined" className="action-btn" onClick={() => setOpen(false)}>
              取り消し
            </Button>
            <Button variant="contained" className="action-btn" onClick={handleFilterApply}>
              適用
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}
