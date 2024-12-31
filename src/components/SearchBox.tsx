"use client";

import { useState } from 'react';

import Slider from '@mui/material/Slider';

const marks = [
  {
    value: 0,
    label: '0',
  },
  {
    value: 500,
    label: '500',
  },
  {
    value: 1000,
    label: '1000',
  },
  {
    value: 2000,
    label: '2000',
  },
];

export default function SearchBox() {
  const [value, setValue] = useState<number>(500);

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value === '' ? 0 : Number(e.target.value));
  };

  return (
    <div className="search-box">
      <div className="search-box-content">
        <h4>検索キーワード</h4>
        <div>
          <input type="text" placeholder="検索" />
        </div>
        <h4>予算</h4>
        <div className="content-slider">
          <Slider
            defaultValue={value}
            marks={marks}
            onChange={handleSliderChange}
            value={typeof value === 'number' ? value : 0}
            min={0}
            max={2000}
            step={100}
            valueLabelDisplay="on"
          />
          <input
            value={value}
            onChange={handleInputChange}
            type="number"
          />
        </div>
        <h4>カテゴリー</h4>
        <div className="search-box-content-filter">
          <button>和食</button>
          <button>洋食</button>
          <button>中華</button>
          <button>韓食</button>
          <button>その他</button>
        </div>
      </div>
      <div className="search-box-pr">
        pr
      </div>
    </div>
  );
};