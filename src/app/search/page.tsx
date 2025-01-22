"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Chip from "@mui/material/Chip";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import RemoveIcon from '@mui/icons-material/Remove';

export default function SearchPage() {
  const router = useRouter();

  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [hotKeywords, setHotKeywords] = useState<HotKeywords[]>([]);

  useEffect(() => {
    const history = localStorage.getItem("search-history");
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
    setHotKeywords([
      { label: "おすすめ1", status: "up" },{ label: "おすすめ2", status: "down" },
      { label: "おすすめ3" }, { label: "おすすめ4", status: "up" },
      { label: "おすすめ5", status: "down" }, { label: "おすすめ6", status: "up" },
      { label: "おすすめ7" }, { label: "おすすめ8", status: "down" },
      { label: "おすすめ9", status: "up" }, { label: "おすすめ10", status: "down" },
    ]);
  }, []);

  const handleClick = (value: string) => {
    router.push(`/search/map?q=${value}`);
  };

  const handleDeleteAll = () => {
    setSearchHistory([]);
    localStorage.removeItem("search-history");
  };

  return (
    <div className="search-page container">
      {/* Suggested Searches */}
      <div className="suggested-wrapper">
        <h2 className="title">
          人気のキーワード
        </h2>
        <div className="suggested-list">
          <div className="left-column">
            {hotKeywords.slice(0, 5).map((keyword, index) => (
              <div key={index} className="suggested-item" onClick={() => handleClick(keyword.label)}>
                <div className="item-title">
                  <div className="rank">{index + 1}</div>
                  <p>{keyword.label}</p>
                </div>
                <div className={`status-icon ${keyword.status}`}>
                  {keyword.status ? <ArrowUpwardIcon fontSize="small" /> : <RemoveIcon fontSize="small" />}
                </div>
              </div>
            ))}
          </div>
          <div className="right-column">
            {hotKeywords.slice(5, 10).map((keyword, index) => (
              <div key={index + 5} className="suggested-item" onClick={() => handleClick(keyword.label)}>
                <div className="item-title">
                  <div className="rank">{index + 6}</div>
                  <p>{keyword.label}</p>
                </div>
                <div className={`status-icon ${keyword.status}`}>
                  {keyword.status ? <ArrowUpwardIcon fontSize="small" /> : <RemoveIcon fontSize="small" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <hr className="container" />
      {/* Search History */}
      <div className="history-wrapper">
        <h2 className="title">
          検索履歴
          <button className={`delete-btn ${searchHistory.length === 0 ? "disabled" : ""}`} onClick={handleDeleteAll}>
            <DeleteOutlineOutlinedIcon fontSize="small" />
            全て削除
          </button>
        </h2>
        {searchHistory.length > 0 ?
          <div className="history-list">
            {searchHistory.map((item, index) => (
              <Chip
                key={index}
                sx={{ backgroundColor: "var(--gray-alpha-200)" }}
                label={<div className="history-label">{item}</div>}
                onClick={() => handleClick(item)}
              />
            ))}
          </div>
          :
          <div className="no-history">
            表示する履歴がありません
          </div>
        }
      </div>
    </div>
  );
}
