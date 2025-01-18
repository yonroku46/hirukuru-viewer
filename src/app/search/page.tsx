"use client";

import Link from "next/link";

export default function SearchPage() {
  return (
    <div className="search-page">
      <Link href="/search/map">
        マップで検索
      </Link>
    </div>
  );
}