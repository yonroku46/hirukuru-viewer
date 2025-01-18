"use client";

import Link from "next/link";

export default function ServicePage() {
  return (
    <div className="service container">
      <Link href="/search/map">
        マップで検索
      </Link>
    </div>
  );
}