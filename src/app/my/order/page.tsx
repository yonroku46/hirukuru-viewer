"use client";

import { useEffect, useState } from "react";
import SearchInput from "@/components/input/SearchInput";
import OrderStatus from "@/components/OrderStatus";
import MuiBreadcrumbs from "@/components/mui/MuiBreadcrumbs";
import MuiTable from "@/components/mui/MuiTable";

export default function MyOrderPage() {
  const breadcrumbs: Breadcrumb[] = [
    { label: 'マイページ', href: '/my' },
    { label: '注文管理', href: '/my/order', active: true },
  ];
  const orderStatus: OrderStatus[] = [
    { type: 'booked', value: 0 },
    { type: 'pickup', value: 1 },
    { type: 'done', value: 1 },
    { type: 'review', value: 1 },
    { type: 'cancel', value: 0 }
  ];

  const columns: Column<Order>[] = [
    { key: 'orderDetail', type: 'list', label: '詳細', width: 80, listColumns: [
      { key: 'foodId', type: 'text', label: '食品ID', hide: true },
      { key: 'name', type: 'text', label: '食品名', minWidth: 100 },
      { key: 'price', type: 'number', label: '単価', minWidth: 100, align: 'right' },
      { key: 'quantity', type: 'number', label: '数量', minWidth: 100, align: 'right' },
      { key: 'totalPrice', type: 'number', label: '金額', minWidth: 100, align: 'right' },
    ] },
    { key: 'orderId', type: 'text', label: '注文ID', hide: true },
    { key: 'userId', type: 'text', label: 'ユーザーID', hide: true },
    { key: 'status', type: 'status', label: '状況', width: 140, align: 'center' },
    { key: 'shopId', type: 'text', label: '店舗ID', minWidth: 100 },
    { key: 'totalPrice', type: 'number', label: '合計金額', minWidth: 100, align: 'right' },
    { key: 'pickupTime', type: 'time', label: '受取日時', minWidth: 100, maxWidth: 100, align: 'right' },
    { key: 'orderTime', type: 'time', label: '注文日時', minWidth: 100, maxWidth: 100, align: 'right' },
  ];
  const rows: Order[] = [
    createData('O101', 'booked', 'U101', 'S101', 2500, '2024-01-01 20:07', '2024-01-01 20:07', [
      { foodId: 'F101', name: '唐揚げ弁当', price: 500, quantity: 1, totalPrice: 500 },
      { foodId: 'F102', name: 'チキン南蛮弁当', price: 1000, quantity: 2, totalPrice: 2000 },
    ]),
    createData('O102', 'pickup', 'U101', 'S101', 500, '2024-01-01 20:10', '2024-01-01 20:10', [
      { foodId: 'F102', name: 'チキン南蛮弁当', price: 500, quantity: 1, totalPrice: 500 },
    ]),
    createData('O103', 'done', 'U101', 'S101', 1000, '2024-01-15 20:10', '2024-01-15 20:10', []),
    createData('O104', 'review', 'U101', 'S101', 1000, '2024-01-15 20:10', '2024-01-15 20:10', []),
    createData('O105', 'cancel', 'U101', 'S101', 1000, '2024-01-01 20:10', '2024-01-01 20:10', []),
  ];

  function createData(
    orderId: string,
    status: string,
    userId: string,
    shopId: string,
    totalPrice: number,
    pickupTime: string,
    orderTime: string,
    orderDetail: OrderDetail[],
  ): Order {
    return { id: orderId, status, orderId, userId, shopId, totalPrice, pickupTime, orderTime, orderDetail };
  }

  const [user, setUser] = useState<User | null>(null);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [searchValue, setSearchValue] = useState<string>("");

  useEffect(() => {
    console.log(year, month);
  }, [year, month]);

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

  const searchFilters: SearchFilter[] = [
    { type: 'year', key: 'year', label: '年度', value: year.toString() },
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
        <OrderStatus
          statusList={orderStatus}
        />
        <hr className="container" style={{ margin: '2rem 0' }} />
        <MuiTable
          topSection={
            <div className="order-history">
              <h2 className="title">
                {`注文履歴 (${year}年${month}月)`}
              </h2>
              <SearchInput
                searchMode
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
          rows={rows}
        />
      </div>
    </article>
  );
}
