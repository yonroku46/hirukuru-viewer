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
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Badge from "@mui/material/Badge";

interface FilterDialogProps {
  filters: SearchFilter[];
  onFilterApply: (updatedFilters: SearchFilter[]) => void;
  invisible?: boolean;
}

export default function FilterDialog({ filters, onFilterApply, invisible }: FilterDialogProps) {
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
      <Badge
        color="secondary"
        variant="dot"
        invisible={invisible}
        sx={{
          '& .MuiBadge-dot': {
            top: '0.5rem',
            right: '0.5rem',
            backgroundColor: 'var(--badge-color)',
          }
        }}
      >
        <MiniButton
          icon={<FilterAltOutlinedIcon />}
          onClick={() => setOpen(true)}
          sx={{
            color: invisible ? 'unset' : 'var(--badge-color)',
          }}
        />
      </Badge>
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
        <DialogContent className="content" style={{ paddingTop: '1.5rem' }}>
          {filters.map((item, index) => {
            const targetFilter = tempFilters.find(filter => filter.key === item.key);
            return (
              <div key={index} className="filter-item">
                <label className="filter-item-label">
                  {item.label}
                </label>
                <div className="filter-item-content">
                  {item.type === "select" && item.options && (
                    <Selector
                      options={item.options}
                      defaultValue={item.value}
                      onChange={(e) => handleFilterChange(item.key, e.target.value)}
                    />
                  )}
                  {item.type === "radio" && (
                    <RadioGroup row value={targetFilter?.value} onChange={(e) => handleFilterChange(item.key, e.target.value)}>
                      {item.options && item.options.map((option, index) => {
                        const repeatCount = option.repeat || 1;
                        const repeatedLabel = Array.from({ length: repeatCount }, () => option.label);
                        return (
                            <FormControlLabel
                              key={index}
                              value={option.value}
                              control={<Radio size="small" />}
                              label={
                                <span style={{
                                  letterSpacing: repeatCount > 1 ? '-8px' : '0',
                                  marginRight: repeatCount > 1 ? '0.5rem' : '0',
                                }}>
                                  {repeatedLabel}
                                </span>
                              }
                            />
                          );
                        })
                      }
                    </RadioGroup>
                  )}
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
              </div>
            );
          })}
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
