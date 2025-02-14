"use client";

import { useEffect, useState } from "react";
import { createKanaSearchRegex } from "@/common/utils/SearchUtils";
import { dateNow } from "@/common/utils/DateUtils";
import dayjs from "dayjs";
import SearchInput from "@/components/input/SearchInput";
import ReviewStatus from "@/components/ReviewStatus";
import MuiBreadcrumbs from "@/components/mui/MuiBreadcrumbs";
import MuiTable from "@/components/mui/MuiTable";
import Title from "@/components/layout/Title";

export default function MyOrderReviewPage() {
  const breadcrumbs: Breadcrumb[] = [
    { label: 'マイページ', href: '/my' },
    { label: '注文管理', href: '/my/order' },
    { label: 'レビュー', href: '/my/order/review', active: true },
  ];
  const reviewStatus: ReviewStatusCount[] = [
    { status: 'COUNT', value: 1100 },
    { status: 'AVG', value: 4.5 },
  ];

  const columns: Column<ShopReview>[] = [
    { key: 'reviewId', type: 'text', label: 'レビューID', hide: true },
    { key: 'userId', type: 'text', label: 'ユーザーID', hide: true },
    { key: 'userProfile', type: 'image', label: 'プロフィール', hide: true },
    { key: 'userName', type: 'text', label: 'ユーザー名', hide: true },
    { key: 'shopId', type: 'text', label: '店舗ID', hide: true },
    { key: 'shopName', type: 'text', label: '店舗名', minWidth: 120, maxWidth: 120 },
    { key: 'comment', type: 'text', label: 'コメント', minWidth: 250, maxWidth: 250 },
    { key: 'reviewRating', type: 'rating', label: '評価', width: 120, align: 'center' },
    { key: 'date', type: 'text', label: '日付', minWidth: 100, maxWidth: 100, align: 'right' },
  ];

  function createData(
    reviewId: string,
    userId: string,
    userName: string,
    userProfile: string,
    shopId: string,
    shopName: string,
    reviewRating: number,
    reviewContent: string,
    createTime: string,
  ): ShopReview {
    return { id: reviewId, reviewId, userId, userName, userProfile, shopId, shopName, reviewRating, reviewContent, createTime };
  }

  const [user, setUser] = useState<UserState | null>(null);
  const [year, setYear] = useState<number>(dateNow().year());
  const [month, setMonth] = useState<number>(dateNow().month() + 1);
  const [searchValue, setSearchValue] = useState<string>("");
  const [rows, setRows] = useState<ShopReview[]>([]);
  const [filteredRows, setFilteredRows] = useState<ShopReview[]>([]);

  useEffect(() => {
    const dummyUser: UserState = {
      userId: 'U101',
      userName: 'テストユーザー',
      profileImg: '/assets/img/no-user.jpg',
      point: 1000,
      shopOwner: false,
      mail: 'test@test.com',
    }
    const dummyRows: ShopReview[] = [
      createData('R101', 'U101', 'テストユーザー', '/assets/img/no-user.jpg', 'S101', '唐揚げ一番', 4, 'このショップはとてもよかったです。', '2025-01-01'),
      createData('R102', 'U102', 'テストユーザー', '/assets/img/no-user.jpg', 'S102', 'チキンが一番', 5, 'うまい！また行きたいです。店員さんも親切でした。', '2025-01-02'),
      createData('R103', 'U102', 'テストユーザー', '/assets/img/no-user.jpg', 'S102', 'チキンが一番', 5, 'Nice!', '2025-02-01'),
    ];
    setUser(dummyUser);
    setRows(dummyRows);
  }, []);

  useEffect(() => {
    const searchRegex = createKanaSearchRegex(searchValue);
    const updatedFilteredRows = rows
      .filter(row => {
        const createDate = dayjs(row.createTime);
        if (createDate.year() !== year || createDate.month() + 1 !== month) return false;
        if (searchValue && !searchRegex.test(row.shopName)) return false;
        return true;
      })
      .sort((a, b) => dayjs(b.createTime).unix() - dayjs(a.createTime).unix());
    setFilteredRows(updatedFilteredRows);
  }, [rows, searchValue, year, month]);

  const searchFilters: SearchFilter[] = [
    { type: 'year', key: 'year', label: '年', value: year.toString() },
    { type: 'month', key: 'month', label: '月', value: month.toString() },
  ]

  const handleFilterApply = (updatedFilters: SearchFilter[]) => {
    updatedFilters.forEach(filter => {
      if (filter.key === 'year') {
        setYear(parseInt(filter.value, 10));
      } else if (filter.key === 'month') {
        setMonth(parseInt(filter.value, 10));
      }
    });
  }

  if (!user) return null;

  return (
    <article>
      <div className="myorder container">
        <MuiBreadcrumbs breadcrumbs={breadcrumbs} />
        <ReviewStatus
          statusList={reviewStatus}
        />
        <hr className="container" style={{ margin: '2rem 0' }} />
        <MuiTable
          topSection={
            <div className="order-history">
              <Title
                title={`レビュー履歴 (${year}年${month}月)`}
              />
              <SearchInput
                searchMode
                placeholder="店舗名で検索"
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                }}
                filters={searchFilters}
                onFilterApply={handleFilterApply}
              />
            </div>
          }
          columns={columns}
          rows={filteredRows}
        />
      </div>
    </article>
  );
}
