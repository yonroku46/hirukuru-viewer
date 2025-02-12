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
    { status: 'BOOKED', value: 0 },
    { status: 'PICKUP', value: 1 },
    { status: 'DONE', value: 1 },
    { status: 'REVIEW', value: 1 },
    { status: 'CANCEL', value: 0 }
  ];

  const columns: Column<Order>[] = [
    { key: 'orderDetail', type: 'list', label: '詳細', width: 60, listColumns: [
        { key: 'orderId', type: 'text', label: '注文ID', hide: true },
        { key: 'itemId', type: 'text', label: '食品ID', hide: true },
        { key: 'itemName', type: 'text', label: '食品名', minWidth: 120, maxWidth: 120 },
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
    { key: 'pickupTime', type: 'time', label: '受取日時', minWidth: 100, maxWidth: 100, align: 'right' },
    { key: 'createTime', type: 'time', label: '注文日時', minWidth: 100, maxWidth: 100, align: 'right' },
  ];

  function createData(
    orderId: string,
    status: OrderStatus['status'],
    userId: string,
    shopId: string,
    shopName: string,
    payType: PayType['type'],
    totalPrice: number,
    pickupTime: string,
    createTime: string,
    orderDetail: OrderDetail[],
  ): Order {
    return { id: orderId, status, orderId, userId, shopId, shopName, payType: payType as PayType['type'], totalPrice, pickupTime, createTime, orderDetail };
  }

  const [user, setUser] = useState<UserState | null>(null);
  const [year, setYear] = useState<number>(dateNow().year());
  const [month, setMonth] = useState<number>(dateNow().month() + 1);
  const [status, setStatus] = useState<string>('all');
  const [searchValue, setSearchValue] = useState<string>("");
  const [rows, setRows] = useState<Order[]>([]);
  const [filteredRows, setFilteredRows] = useState<Order[]>([]);

  useEffect(() => {
    const dummyUser: UserState = {
      userId: 'U101',
      userName: 'テストユーザー',
      profileImg: '/assets/img/no-user.jpg',
      point: 1000,
      shopOwner: false,
      mail: 'test@test.com',
    }
    const dummyRows: Order[] = [
      createData('O101', 'BOOKED', 'U101', 'S101', 'テスト店舗', 'CASH', 2900, '2025-01-01 20:07', '2025-01-01 20:07', [
        { orderId: 'O101', itemId: 'F101', itemName: '唐揚げ弁当', itemPrice: 500, quantity: 1, itemTotalPrice: 900, options: [
          { optionName: 'コーラ', optionPrice: 100 },
          { optionName: 'メガ盛り', optionPrice: 300 },
        ]},
        { orderId: 'O101', itemId: 'F102', itemName: 'チキン南蛮弁当', itemPrice: 1000, quantity: 2, itemTotalPrice: 2000, options: [
          { optionName: '特盛り', optionPrice: 1000 },
        ] },
      ]),
      createData('O102', 'PICKUP', 'U101', 'S101', 'テスト店舗', 'CARD', 500, '2025-01-01 20:10', '2025-01-02 20:10', [
        { orderId: 'O102', itemId: 'F102', itemName: 'チキン南蛮弁当', itemPrice: 500, quantity: 1, itemTotalPrice: 500 },
      ]),
      createData('O103', 'DONE', 'U101', 'S101', 'テスト店舗', 'GOOGLE', 1000, '2025-01-15 20:10', '2025-01-15 20:10', []),
      createData('O104', 'REVIEW', 'U101', 'S101', 'テスト店舗', 'APPLE', 1000, '2025-01-15 20:10', '2025-01-14 20:10', []),
      createData('O105', 'CANCEL', 'U101', 'S101', 'テスト店舗', 'CASH', 1000, '', '2025-02-01 20:10', []),
    ];
    setUser(dummyUser);
    setRows(dummyRows);
  }, []);

  useEffect(() => {
    const searchRegex = createKanaSearchRegex(searchValue);
    const updatedFilteredRows = rows
      .filter(row => {
        if (status !== 'all' && row.status !== status) return false;
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
      [{ label: '全て', value: 'all' }, ...orderStatus.map(status => (
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
