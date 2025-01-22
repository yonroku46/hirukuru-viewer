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
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  filters?: SearchFilter[];
  onFilterApply?: (updatedFilters: SearchFilter[]) => void;
}

export default function SearchInput({ value, placeholder, searchMode, autoFocus, onChange, onKeyDown, filters, onFilterApply }: SearchInputProps) {
  const router = useRouter();

  const [showClearIcon, setShowClearIcon] = useState<boolean>(false);
  const [filtersChanged, setFiltersChanged] = useState<boolean>(false);
  const [initialFilters, setInitialFilters] = useState<SearchFilter[]>(filters || []);

  useEffect(() => {
    setInitialFilters(filters || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setShowClearIcon(value === "" ? false : true);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setShowClearIcon(e.target.value === "" ? false : true);
    onChange(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter" && onKeyDown) {
      onKeyDown(e);
    }
  };

  const handleIconClick = (): void => {
    if (onKeyDown && value !== "") {
      onKeyDown({ key: "Enter" } as React.KeyboardEvent<HTMLInputElement>);
    }
  };

  const handleClick = (): void => {
    onChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
    setShowClearIcon(false);
  };

  const handleSearchClick = (): void => {
    router.push("/search");
  };

  const handleReset = (): void => {
    handleFilterApply(initialFilters);
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
      />
    );
  }

  return (
    <div className="search-input">
      {filters && onFilterApply &&
        <FilterDialog
          filters={filters}
          onReset={handleReset}
          onFilterApply={handleFilterApply}
          changed={!filtersChanged}
        />
      }
      <div className="input-wrapper">
        <SearchIcon className="search-icon" onClick={handleIconClick} />
        <input
          type="text"
          placeholder={placeholder || "検索"}
          autoFocus={autoFocus}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <ClearIcon className={`clear-icon ${showClearIcon ? "active" : ""}`} onClick={handleClick}/>
      </div>
    </div>
  );
};