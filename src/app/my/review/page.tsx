"use client";

import { useCallback, useEffect, useState } from "react";
import { createKanaSearchRegex } from "@/common/utils/SearchUtils";
import { dateNow } from "@/common/utils/DateUtils";
import dayjs from "dayjs";
import SearchInput from "@/components/input/SearchInput";
import ReviewStatus from "@/components/ReviewStatus";
import MuiBreadcrumbs from "@/components/mui/MuiBreadcrumbs";
import MuiTable from "@/components/mui/MuiTable";
import Title from "@/components/layout/Title";
import { useAppSelector } from "@/store";
import UserService from "@/api/service/UserService";
import { useRouter } from "next/navigation";

export default function MyReviewPage() {
  const breadcrumbs: Breadcrumb[] = [
    { label: 'マイページ', href: '/my' },
    { label: 'レビュー', href: '/my/review', active: true },
  ];

  const columns: Column<ReviewState>[] = [
    { key: 'reviewId', type: 'text', label: 'レビューID', hide: true },
    { key: 'shopName', type: 'text', label: '店舗名', minWidth: 120, maxWidth: 120 },
    { key: 'orderSummary', type: 'text', label: '注文概要', minWidth: 250, maxWidth: 250 },
    { key: 'reviewContent', type: 'text', label: 'コメント', minWidth: 250, maxWidth: 250 },
    { key: 'reviewRating', type: 'rating', label: '評価', width: 120, align: 'center' },
    { key: 'createTime', type: 'date', label: '日付', minWidth: 100, maxWidth: 100, align: 'right' },
  ];

  const router = useRouter();
  const authState = useAppSelector((state) => state.auth);

  const userService = UserService();

  const [user, setUser] = useState<UserState | null>(null);
  const [year, setYear] = useState<number>(dateNow().year());
  const [month, setMonth] = useState<number>(dateNow().month() + 1);
  const [searchValue, setSearchValue] = useState<string>("");
  const [rows, setRows] = useState<ReviewState[]>([]);
  const [filteredRows, setFilteredRows] = useState<ReviewState[]>([]);
  const [reviewStatus, setReviewStatus] = useState<ReviewStatusCount[]>([]);

  const getUserInfo = useCallback(() => {
    userService.userInfo().then((user) => {
      if (user) {
        setUser(user);
      }
    });
  }, [userService]);

  const getReviewStatus = useCallback(() => {
    userService.getReviewStatus().then((res) => {
      if (res?.list) {
        setReviewStatus(res.list);
      }
    });
  }, [userService]);

  const getReviewHistory = useCallback(() => {
    userService.getReviewHistory().then((res) => {
      if (res?.list) {
        setRows(res.list);
      }
    });
  }, [userService]);

  useEffect(() => {
    if (!authState.hasLogin) {
      router.replace('/login');
      return;
    } else if (!user) {
      getUserInfo();
      getReviewStatus();
      getReviewHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <MuiBreadcrumbs breadcrumbs={breadcrumbs} />
      <div className="myreview container">
        <ReviewStatus
          title="マイレビュー"
          statusList={reviewStatus}
        />
        <hr className="container" style={{ margin: '1rem 0' }} />
        <MuiTable
          topSection={
            <div className="history-wrapper">
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
