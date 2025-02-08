"use client";

import { useEffect, useState } from "react";
// import { orderStatusDict } from "@/common/utils/StringUtils";
// import { createKanaSearchRegex } from "@/common/utils/SearchUtils";
// import SearchInput from "@/components/input/SearchInput";
import MuiBreadcrumbs from "@/components/mui/MuiBreadcrumbs";

export default function MyCouponPage() {
  const breadcrumbs: Breadcrumb[] = [
    { label: 'マイページ', href: '/my' },
    { label: 'クーポン', href: '/my/coupon', active: true },
  ];

  const [user, setUser] = useState<UserState | null>(null);
  // const [searchValue, setSearchValue] = useState<string>("");

  useEffect(() => {
    const dummyUser: UserState = {
      userId: 'U101',
      userName: 'テストユーザー',
      profileImg: '/assets/img/no-user.jpg',
      point: 1000,
      shopOwner: false,
      mail: 'test@test.com',
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
