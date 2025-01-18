"use client";

import { useState } from 'react';

interface SwitchButtonProps {
  labels: [{ label: string; value: string }, { label: string; value: string }];
  onChange: (selectedLabel: string) => void;
}

export default function SwitchButton({ labels, onChange }: SwitchButtonProps) {
  const [selectedValue, setSelectedValue] = useState(labels[0].value);

  function handleButtonClick(value: string) {
    setSelectedValue(value);
    onChange(value);
  }

  return (
    <div className="switch-btn-group">
      <div
        className="background-circle"
        style={{
          left: `${labels.findIndex(item => item.value === selectedValue) * 50}%`,
        }}
      />
      {labels.map((item, index) => (
        <button
          key={index}
          className={`switch-btn ${selectedValue === item.value ? 'active' : ''}`}
          onClick={() => handleButtonClick(item.value)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};