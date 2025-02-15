"use client";

import React from "react";

import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface TimeInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  placeholder?: string;
}

export default function TimeInput({ value, placeholder, ...props }: TimeInputProps) {
  return (
    <div className="time-input">
      <div className="input-wrapper">
        <input
          type="text"
          placeholder={placeholder || "時間選択"}
          value={value}
          readOnly
          {...props}
        />
        <AccessTimeIcon className="time-icon"/>
      </div>
    </div>
  );
};