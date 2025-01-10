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
    { key: 'orderDetail', type: 'list', label: '詳細', minWidth: 80, maxWidth: 80, listColumns: [
      { key: 'foodId', type: 'text', label: '食品ID', hide: true },
      { key: 'name', type: 'text', label: '食品名', minWidth: 100 },
      { key: 'quantity', type: 'number', label: '数量', minWidth: 100, align: 'right' },
      { key: 'price', type: 'number', label: '価格', minWidth: 100, align: 'right' },
      { key: 'discountPrice', type: 'number', label: '割引価格', minWidth: 100, align: 'right' },
    ] },
    { key: 'orderId', type: 'text', label: '注文ID', minWidth: 100 },
    { key: 'userId', type: 'text', label: 'ユーザーID', hide: true },
    { key: 'shopId', type: 'text', label: '店舗ID', minWidth: 100 },
    { key: 'totalPrice', type: 'number', label: '合計価格', minWidth: 100 },
    { key: 'status', type: 'status', label: '状況', minWidth: 100, maxWidth: 100, align: 'center' },
    { key: 'date', type: 'text', label: '注文日', minWidth: 100, maxWidth: 100, align: 'center' },
  ];
  const rows: Order[] = [
    createData('O101', 'booked', 'U101', 'S101', 1000, '2024-01-01', [
      { foodId: 'F101', name: '唐揚げ弁当', quantity: 1, price: 500 },
      { foodId: 'F102', name: 'チキン南蛮弁当', quantity: 2, price: 1000, discountPrice: 900 },
    ]),
    createData('O102', 'pickup', 'U101', 'S101', 1000, '2024-01-01', [
      { foodId: 'F102', name: 'チキン南蛮弁当', quantity: 1, price: 500 },
    ]),
    createData('O103', 'done', 'U101', 'S101', 1000, '2024-01-01', []),
    createData('O104', 'review', 'U101', 'S101', 1000, '2024-01-01', []),
    createData('O105', 'cancel', 'U101', 'S101', 1000, '2024-01-01', []),
  ];

  function createData(
    orderId: string,
    status: string,
    userId: string,
    shopId: string,
    totalPrice: number,
    date: string,
    orderDetail: OrderDetail[],
  ): Order {
    return { id: orderId, status, orderId, userId, shopId, totalPrice, date, orderDetail };
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
