"use client";

import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useRouter } from "next/navigation";

interface SearchInputProps {
  value: string;
  searchMode?: boolean;
  autoFocus?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchInput({ value, searchMode, autoFocus, onChange }: SearchInputProps) {
  const router = useRouter();
  const [showClearIcon, setShowClearIcon] = useState<0 | 1>(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setShowClearIcon(e.target.value === "" ? 0 : 1);
    onChange(e);
  };

  const handleClick = (): void => {
    onChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
    setShowClearIcon(0);
  };

  const handleSearchClick = (): void => {
    router.push("/search");
  };

  if (!searchMode) {
    return (
      <div className="search-input-btn" onClick={handleSearchClick}>
        <SearchIcon className="search-icon" />
      </div>
    );
  }

  return (
    <div className="search-input">
      <SearchIcon className="search-icon" />
      <input
        type="text"
        placeholder="検索"
        autoFocus={autoFocus}
        value={value}
        onChange={handleChange}
      />
      <ClearIcon className={`clear-icon ${showClearIcon ? "active" : ""}`} onClick={handleClick}/>
    </div>
  );
};