"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MiniButton from "@/components/button/MiniButton";
import FilterDialog from "@/components/FilterDialog";

import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

interface SearchInputProps {
  value: string;
  searchMode?: boolean;
  autoFocus?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  filters?: SearchFilter[];
  onFilterApply?: (updatedFilters: SearchFilter[]) => void;
}

export default function SearchInput({ value, searchMode, autoFocus, onChange, filters, onFilterApply }: SearchInputProps) {
  const router = useRouter();

  const [showClearIcon, setShowClearIcon] = useState<boolean>(false);
  useEffect(() => {
    setShowClearIcon(value === "" ? false : true);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setShowClearIcon(e.target.value === "" ? false : true);
    onChange(e);
  };

  const handleClick = (): void => {
    onChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
    setShowClearIcon(false);
  };

  const handleSearchClick = (): void => {
    router.push("/search");
  };

  if (!searchMode) {
    return (
      <MiniButton
        icon={<SearchIcon />}
        onClick={handleSearchClick}
        sx={{
          marginRight: "0.75rem",
        }}
      />
    );
  }

  return (
    <div className="search-input">
      {filters && onFilterApply &&
        <FilterDialog
          filters={filters}
          onFilterApply={onFilterApply}
        />
      }
      <div className="input-wrapper">
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
    </div>
  );
};