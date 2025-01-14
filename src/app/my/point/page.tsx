"use client";

import { useEffect, useState } from "react";
// import { orderStatusDict } from "@/common/utils/StringUtils";
// import { createKanaSearchRegex } from "@/common/utils/SearchUtils";
// import SearchInput from "@/components/input/SearchInput";
import MuiBreadcrumbs from "@/components/mui/MuiBreadcrumbs";

export default function MyPointPage() {
  const breadcrumbs: Breadcrumb[] = [
    { label: 'マイページ', href: '/my' },
    { label: 'ポイント', href: '/my/point', active: true },
  ];

  const [user, setUser] = useState<User | null>(null);
  // const [searchValue, setSearchValue] = useState<string>("");

  useEffect(() => {
    const dummyUser = {
      userId: 'U101',
      name: 'テストユーザー',
      profileImage: '/assets/img/no-user.jpg',
      point: 1000,
      shopOwner: false,
    }
    setUser(dummyUser);
  }, []);

  if (!user) return null;

  return (
    <article>
      <div className="my container">
        <MuiBreadcrumbs breadcrumbs={breadcrumbs} />
      </div>
    </article>
  );
}
