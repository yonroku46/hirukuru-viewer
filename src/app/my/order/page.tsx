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
    { key: 'orderId', type: 'text', label: 'Order ID', minWidth: 100 },
    { key: 'status', type: 'status', label: 'Status', minWidth: 100 },
    { key: 'userId', type: 'text', label: 'User ID', hide: true, minWidth: 100 },
    { key: 'shopId', type: 'text', label: 'Shop ID', minWidth: 100 },
    { key: 'totalPrice', type: 'number', label: 'Total Price', minWidth: 100 },
    { key: 'date', type: 'text', label: 'Date', minWidth: 100 },
  ];
  const rows: Order[] = [
    createData('O101', 'booked', 'U101', 'S101', 1000, '2024-01-01'),
    createData('O101', 'pickup', 'U101', 'S101', 1000, '2024-01-01'),
    createData('O101', 'done', 'U101', 'S101', 1000, '2024-01-01'),
    createData('O101', 'review', 'U101', 'S101', 1000, '2024-01-01'),
    createData('O101', 'cancel', 'U101', 'S101', 1000, '2024-01-01'),
  ];

  function createData(
    orderId: string,
    status: string,
    userId: string,
    shopId: string,
    totalPrice: number,
    date: string,
  ): Order {
    return { id: orderId, status, orderId, userId, shopId, totalPrice, date };
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
