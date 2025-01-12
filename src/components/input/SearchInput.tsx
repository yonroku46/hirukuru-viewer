"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MiniButton from "@/components/button/MiniButton";
import FilterDialog from "@/components/FilterDialog";

import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

interface SearchInputProps {
  value: string;
  placeholder?: string;
  searchMode?: boolean;
  autoFocus?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  filters?: SearchFilter[];
  onFilterApply?: (updatedFilters: SearchFilter[]) => void;
}

export default function SearchInput({ value, placeholder, searchMode, autoFocus, onChange, filters, onFilterApply }: SearchInputProps) {
  const router = useRouter();

  const [showClearIcon, setShowClearIcon] = useState<boolean>(false);
  const [filtersChanged, setFiltersChanged] = useState<boolean>(false);
  const [initialFilters, setInitialFilters] = useState<SearchFilter[] | undefined>(filters);

  useEffect(() => {
    setInitialFilters(filters);
  }, []);

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

  const handleFilterApply = (updatedFilters: SearchFilter[]) => {
    const filtersAreDifferent = JSON.stringify(initialFilters) !== JSON.stringify(updatedFilters);
    setFiltersChanged(filtersAreDifferent);
    if (onFilterApply) {
      onFilterApply(updatedFilters);
    }
  };

  if (!searchMode) {
    return (
      <MiniButton
        icon={<SearchIcon />}
        onClick={handleSearchClick}
        sx={{
          marginRight: "0.85rem",
        }}
      />
    );
  }

  return (
    <div className="search-input">
      {filters && onFilterApply &&
        <FilterDialog
          filters={filters}
          onFilterApply={handleFilterApply}
          invisible={!filtersChanged}
        />
      }
      <div className="input-wrapper">
        <SearchIcon className="search-icon" />
        <input
          type="text"
          placeholder={placeholder || "検索"}
          autoFocus={autoFocus}
          value={value}
          onChange={handleChange}
        />
        <ClearIcon className={`clear-icon ${showClearIcon ? "active" : ""}`} onClick={handleClick}/>
      </div>
    </div>
  );
};