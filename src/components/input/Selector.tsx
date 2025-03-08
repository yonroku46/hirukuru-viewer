"use client";

import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';

interface SelectorProps {
  options: { label: string; value: string }[];
  placeholder?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function Selector({ options, placeholder, value, onChange }: SelectorProps) {
  return (
    <div className="selector">
      <select className={`custom-select ${placeholder ? "placeholder" : ""}`} value={value} onChange={onChange}>
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
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