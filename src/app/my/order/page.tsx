"use client";

import { useEffect, useState } from "react";
import { orderStatusDict } from "@/common/utils/StringUtils";
import { createKanaSearchRegex } from "@/common/utils/SearchUtils";
import { dateNow } from "@/common/utils/DateUtils";
import dayjs from "dayjs";
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
    { key: 'orderDetail', type: 'list', label: '詳細', width: 60, listColumns: [
        { key: 'orderId', type: 'text', label: '注文ID', hide: true },
        { key: 'foodId', type: 'text', label: '食品ID', hide: true },
        { key: 'name', type: 'text', label: '食品名', minWidth: 120, maxWidth: 120 },
        { key: 'price', type: 'number', typeUnit: '円', label: '単価', minWidth: 80, maxWidth: 80, align: 'right' },
        { key: 'options', type: 'options', label: 'オプション', minWidth: 140, maxWidth: 140 },
        { key: 'quantity', type: 'number', label: '数量', minWidth: 100, align: 'right' },
        { key: 'totalPrice', type: 'number', typeUnit: '円', label: '金額', minWidth: 100, align: 'right' },
      ]
    },
    { key: 'orderId', type: 'text', label: '注文ID', hide: true },
    { key: 'userId', type: 'text', label: 'ユーザーID', hide: true },
    { key: 'status', type: 'status', label: '状況', width: 140, align: 'center' },
    { key: 'shopId', type: 'text', label: '店舗ID', hide: true },
    { key: 'shopName', type: 'text', label: '店舗名', minWidth: 100, maxWidth: 200 },
    { key: 'payType', type: 'payType', label: '支払方法', minWidth: 100, maxWidth: 100, align: 'right' },
    { key: 'totalPrice', type: 'number', typeUnit: '円', label: '合計金額', minWidth: 100, align: 'right' },
    { key: 'pickupTime', type: 'time', label: '受取日時', minWidth: 100, maxWidth: 100, align: 'right' },
    { key: 'orderTime', type: 'time', label: '注文日時', minWidth: 100, maxWidth: 100, align: 'right' },
  ];

  function createData(
    orderId: string,
    status: string,
    userId: string,
    shopId: string,
    shopName: string,
    payType: string,
    totalPrice: number,
    pickupTime: string,
    orderTime: string,
    orderDetail: OrderDetail[],
  ): Order {
    return { id: orderId, status, orderId, userId, shopId, shopName, payType: payType as PayType['type'], totalPrice, pickupTime, orderTime, orderDetail };
  }

  const [user, setUser] = useState<User | null>(null);
  const [year, setYear] = useState<number>(dateNow().year());
  const [month, setMonth] = useState<number>(dateNow().month() + 1);
  const [status, setStatus] = useState<string>('all');
  const [searchValue, setSearchValue] = useState<string>("");
  const [rows, setRows] = useState<Order[]>([]);
  const [filteredRows, setFilteredRows] = useState<Order[]>([]);

  useEffect(() => {
    const dummyUser = {
      userId: 'U101',
      name: 'テストユーザー',
      profileImg: '/assets/img/no-user.jpg',
      point: 1000,
      shopOwner: false,
    }
    const dummyRows: Order[] = [
      createData('O101', 'booked', 'U101', 'S101', 'テスト店舗', 'cash', 2500, '2025-01-01 20:07', '2025-01-01 20:07', [
        { orderId: 'O101', foodId: 'F101', name: '唐揚げ弁当', price: 500, quantity: 1, totalPrice: 900, options: [
          { optionId: 'O101', foodId: 'F101', shopId: 'S101', name: 'コーラ', price: 100 },
          { optionId: 'O102', foodId: 'F101', shopId: 'S101', name: 'メガ盛り', price: 300 },
        ]},
        { orderId: 'O101', foodId: 'F102', name: 'チキン南蛮弁当', price: 1000, quantity: 2, totalPrice: 2000, options: [
          { optionId: 'O103', foodId: 'F102', shopId: 'S101', name: '特盛り', price: 1000 },
        ] },
      ]),
      createData('O102', 'pickup', 'U101', 'S101', 'テスト店舗', 'card', 500, '2025-01-01 20:10', '2025-01-02 20:10', [
        { orderId: 'O102', foodId: 'F102', name: 'チキン南蛮弁当', price: 500, quantity: 1, totalPrice: 500 },
      ]),
      createData('O103', 'done', 'U101', 'S101', 'テスト店舗', 'google', 1000, '2025-01-15 20:10', '2025-01-15 20:10', []),
      createData('O104', 'review', 'U101', 'S101', 'テスト店舗', 'apple', 1000, '2025-01-15 20:10', '2025-01-14 20:10', []),
      createData('O105', 'cancel', 'U101', 'S101', 'テスト店舗', 'cash', 1000, '', '2025-02-01 20:10', []),
    ];
    setUser(dummyUser);
    setRows(dummyRows);
  }, []);

  useEffect(() => {
    const searchRegex = createKanaSearchRegex(searchValue);
    const updatedFilteredRows = rows
      .filter(row => {
        if (status !== 'all' && row.status !== status) return false;
        const orderDate = dayjs(row.orderTime);
        if (orderDate.year() !== year || orderDate.month() + 1 !== month) return false;
        if (searchValue && !row.orderDetail.some(detail => searchRegex.test(detail.name))) return false;
        return true;
      })
      .sort((a, b) => dayjs(b.orderTime).unix() - dayjs(a.orderTime).unix());
    setFilteredRows(updatedFilteredRows);
  }, [rows, searchValue, status, year, month]);

  const searchFilters: SearchFilter[] = [
    { type: 'year', key: 'year', label: '年度', value: year.toString() },
    { type: 'month', key: 'month', label: '月', value: month.toString() },
    { type: 'select', key: 'status', label: '状況', value: status, options:
      [{ label: '全て', value: 'all' }, ...orderStatus.map(status => (
        { label: orderStatusDict(status.type, 'label'), value: status.type }
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
        setStatus(filter.value);
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
                placeholder="食品名で検索"
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
