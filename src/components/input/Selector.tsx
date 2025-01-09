"use client";

import React from "react";
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';

interface SelectorProps {
  options: { label: string; value: string }[];
  defaultValue?: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function Selector({ options, defaultValue, onChange }: SelectorProps) {
  return (
    <div className="selector">
      <select onChange={onChange} defaultValue={defaultValue || options[0].value}>
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