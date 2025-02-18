"use client";

import { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store";
import { orderStatusDict } from "@/common/utils/StringUtils";
import { createKanaSearchRegex } from "@/common/utils/SearchUtils";
import { dateNow } from "@/common/utils/DateUtils";
import UserService from "@/api/service/UserService";
import SearchInput from "@/components/input/SearchInput";
import OrderStatus from "@/components/OrderStatus";
import MuiBreadcrumbs from "@/components/mui/MuiBreadcrumbs";
import MuiTable from "@/components/mui/MuiTable";
import Title from "@/components/layout/Title";

export default function MyOrderPage() {
  const breadcrumbs: Breadcrumb[] = [
    { label: 'マイページ', href: '/my' },
    { label: '注文管理', href: '/my/order', active: true },
  ];

  const columns: Column<OrderState>[] = [
    { key: 'orderDetail', type: 'list', label: '詳細', width: 60, listColumns: [
        { key: 'orderId', type: 'text', label: '注文ID', hide: true },
        { key: 'itemId', type: 'text', label: '商品ID', hide: true },
        { key: 'itemName', type: 'text', label: '商品名', minWidth: 120, maxWidth: 120 },
        { key: 'itemPrice', type: 'number', typeUnit: '円', label: '単価', minWidth: 80, maxWidth: 80, align: 'right' },
        { key: 'options', type: 'options', label: 'オプション', minWidth: 140, maxWidth: 140 },
        { key: 'quantity', type: 'number', label: '数量', minWidth: 100, align: 'right' },
        { key: 'itemTotalPrice', type: 'number', typeUnit: '円', label: '金額', minWidth: 100, align: 'right' },
      ]
    },
    { key: 'orderId', type: 'text', label: '注文ID', hide: true },
    { key: 'userId', type: 'text', label: 'ユーザーID', hide: true },
    { key: 'status', type: 'status', label: '状況', width: 140, align: 'center' },
    { key: 'shopId', type: 'text', label: '店舗ID', hide: true },
    { key: 'shopName', type: 'text', label: '店舗名', minWidth: 100, maxWidth: 200 },
    { key: 'payType', type: 'payType', label: '支払方法', minWidth: 100, maxWidth: 100, align: 'right' },
    { key: 'totalPrice', type: 'number', typeUnit: '円', label: '合計金額', minWidth: 100, align: 'right' },
    { key: 'pickupTime', type: 'time', label: '受取予定', minWidth: 100, maxWidth: 100, align: 'right' },
    { key: 'createTime', type: 'time', label: '注文日時', minWidth: 100, maxWidth: 100, align: 'right' },
  ];

  const router = useRouter();
  const authState = useAppSelector((state) => state.auth);

  const userService = UserService();

  const [user, setUser] = useState<UserState | null>(null);
  const [year, setYear] = useState<number>(dateNow().year());
  const [month, setMonth] = useState<number>(dateNow().month() + 1);
  const [status, setStatus] = useState<OrderStatusCount['status'] | "ALL">("ALL");
  const [searchValue, setSearchValue] = useState<string>("");
  const [rows, setRows] = useState<OrderState[]>([]);
  const [filteredRows, setFilteredRows] = useState<OrderState[]>([]);
  const [orderStatus, setOrderStatus] = useState<OrderStatusCount[]>([]);

  const getUserInfo = useCallback(() => {
    userService.userInfo().then((user) => {
      if (user) {
        setUser(user);
      }
    });
  }, [userService]);

  const getOrderStatus = useCallback(() => {
    userService.getOrderStatus().then((res) => {
      if (res?.list) {
        setOrderStatus(res.list);
      }
    });
  }, [userService]);

  const getOrderHistory = useCallback(() => {
    userService.getOrderHistory().then((res) => {
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
      getOrderStatus();
      getOrderHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const searchRegex = createKanaSearchRegex(searchValue);
    const updatedFilteredRows = rows
      .filter(row => {
        if (status !== 'ALL' && row.status !== status) return false;
        const orderDate = dayjs(row.createTime);
        if (orderDate.year() !== year || orderDate.month() + 1 !== month) return false;
        if (searchValue && (!Array.isArray(row.orderDetail) || !row.orderDetail.some((detail: OrderDetail) => searchRegex.test(detail.itemName)))) return false;
        return true;
      })
      .sort((a, b) => dayjs(b.createTime).unix() - dayjs(a.createTime).unix());
    setFilteredRows(updatedFilteredRows);
  }, [rows, searchValue, status, year, month]);

  const searchFilters: SearchFilter[] = [
    { type: 'year', key: 'year', label: '年度', value: year.toString() },
    { type: 'month', key: 'month', label: '月', value: month.toString() },
    { type: 'select', key: 'status', label: '状況', value: status, options:
      [{ label: '全て', value: 'ALL' }, ...orderStatus.map(status => (
        { label: orderStatusDict(status.status, 'label'), value: status.status }
      ))]
    },
  ]

  const handleFilterApply = (updatedFilters: SearchFilter[]) => {
    updatedFilters.forEach(filter => {
      if (filter.key === 'year') {
        setYear(parseInt(filter.value, 10));
      } else if (filter.key === 'month') {
        setMonth(parseInt(filter.value, 10));
      } else if (filter.key === 'status') {
        setStatus(filter.value as OrderStatusCount['status'] | "ALL");
      }
    });
  }

  if (!user) return null;

  return (
    <article>
      <MuiBreadcrumbs breadcrumbs={breadcrumbs} />
      <div className="myorder container">
        <OrderStatus
          statusList={orderStatus}
        />
        <hr className="container" style={{ margin: '2rem 0' }} />
        <MuiTable
          topSection={
            <div className="order-history">
              <Title
                title={`注文履歴 (${year}年${month}月)`}
              />
              <SearchInput
                searchMode
                placeholder="商品・店舗名で検索"
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
