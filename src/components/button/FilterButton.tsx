"use client";

import { useEffect, useState } from 'react';

import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';

interface FilterOption {
  label: string;
  value: string;
  selected?: boolean;
}

interface FilterButtonProps {
  icon?: React.ReactNode;
  label: string;
  active: boolean;
  onClick?: () => void;
  onReset?: () => void;
  onApply?: (value: string) => void;
  options?: FilterOption[];
  optionMultiple?: boolean;
}

export default function FilterButton({ icon, label, active, onClick, onReset, onApply, options, optionMultiple }: FilterButtonProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [tempOptions, setTempOptions] = useState<FilterOption[]>(options || []);
  const [selectedCount, setSelectedCount] = useState<number>(0);
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (options) {
      const count = options.filter(option => option.selected).length;
      setSelectedCount(count);
    }
  }, [options]);

  const handleButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    if (onClick) {
      onClick();
      return;
    }
    if (onReset || onApply) {
      setAnchorEl(event.currentTarget);
    }
  }

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOptionChange = (index: number) => {
    const newOptions = [...tempOptions];

    if (optionMultiple) {
      newOptions[index].selected = !newOptions[index].selected;
    } else {
      newOptions.forEach((option, i) => {
        option.selected = i === index;
      });
    }
    setTempOptions(newOptions);
  }

  const handleReset = () => {
    if (options) {
      const resetOptions = options.map(option => ({
        ...option,
        selected: false
      }));
      setTempOptions(resetOptions);
    }
    if (onReset) {
      onReset();
      handleClose();
    }
  }

  const handleApply = () => {
    if (options && onApply) {
      const selectedValues = tempOptions
        .filter(option => option.selected)
        .map(option => option.value);
      if (selectedValues.length > 0) {
        onApply(optionMultiple ? selectedValues.join(',') : selectedValues[0]);
      }
    }
    handleClose();
  }

  return (
    <div className="filter-btn-wrapper">
      <button className={`filter-btn ${active ? 'active' : ''}`} onClick={handleButtonClick}>
        <div className="filter-icon">
          {icon}
        </div>
        {label}
        {optionMultiple && selectedCount > 0 && `(${selectedCount})`}
      </button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            style: {
              maxHeight: 400,
              width: '300px',
              marginTop: "0.25rem",
              border: "1px solid var(--gray-alpha-300)",
              borderRadius: "0.75rem",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
              scrollbarColor: "var(--gray-alpha-300) transparent",
            },
          },
          list: {
            style: {
              padding: "0.75rem 0"
            },
          },
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', marginBottom: '0.5rem', marginLeft: '0.75rem' }}>{label}</Typography>
        {tempOptions.map((option, index) => (
          <MenuItem
            key={option.value}
            onClick={() => handleOptionChange(index)}
            sx={{
              padding: "0.125rem 1rem",
              minHeight: "unset",
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            {optionMultiple ? (
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={option.selected}
                    onChange={() => handleOptionChange(index)}
                    onClick={(e) => e.stopPropagation()}
                  />
                }
                label={option.label}
              />
            ) : (
              <FormControlLabel
                control={
                  <Radio
                    size="small"
                    checked={option.selected}
                    onChange={() => handleOptionChange(index)}
                    onClick={(e) => e.stopPropagation()}
                  />
                }
                label={option.label}
              />
            )}
          </MenuItem>
        ))}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem', marginRight: '1rem' }}>
          <Button variant="outlined" onClick={handleReset}>
            リセット
          </Button>
          <Button variant="contained" onClick={handleApply}>
            適用
          </Button>
        </Box>
      </Menu>
    </div>
  );
};