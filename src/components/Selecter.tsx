"use client";

import React from "react";
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';

interface SelecterProps {
  options: { label: string; value: string }[];
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function Selecter({ options, onChange }: SelecterProps) {
  return (
    <div className="selecter">
      <select onChange={onChange}>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ArrowDropDownRoundedIcon className="arrow-down" />
    </div>
  );
};