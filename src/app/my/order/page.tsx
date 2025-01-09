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
  const statusList: OrderStatus[] = [
    { type: 'booked', value: 0 },
    { type: 'pickup', value: 1 },
    { type: 'done', value: 1 },
    { type: 'review', value: 1 },
    { type: 'cancel', value: 0 }
  ];

  const columns: Column[] = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'code', label: 'ISO\u00a0Code', minWidth: 100 },
    {
      id: 'population',
      label: 'Population',
      minWidth: 170,
      align: 'right',
      format: (value: number) => value.toLocaleString('en-US'),
    },
    {
      id: 'size',
      label: 'Size\u00a0(km\u00b2)',
      minWidth: 170,
      align: 'right',
      format: (value: number) => value.toLocaleString('en-US'),
    },
    {
      id: 'density',
      label: 'Density',
      minWidth: 170,
      align: 'right',
      format: (value: number) => value.toFixed(2),
    },
  ];
  const rows = [
    createData('India', 'IN', 1324171354, 3287263),
    createData('China', 'CN', 1403500365, 9596961),
    createData('Italy', 'IT', 60483973, 301340),
    createData('United States', 'US', 327167434, 9833520),
    createData('Canada', 'CA', 37602103, 9984670),
    createData('Australia', 'AU', 25475400, 7692024),
    createData('Germany', 'DE', 83019200, 357578),
    createData('Ireland', 'IE', 4857000, 70273),
    createData('Mexico', 'MX', 126577691, 1972550),
    createData('Japan', 'JP', 126317000, 377973),
    createData('France', 'FR', 67022000, 640679),
    createData('United Kingdom', 'GB', 67545757, 242495),
    createData('Russia', 'RU', 146793744, 17098246),
    createData('Nigeria', 'NG', 200962417, 923768),
    createData('Brazil', 'BR', 210147125, 8515767),
  ];

  function createData(
    name: string,
    code: string,
    population: number,
    size: number,
  ): Rows {
    const density = population / size;
    return { name, code, population, size, density };
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
          statusList={statusList}
        />
        <hr className="container" />
        <div className="order-history">
          <h2 className="title">
            注文履歴
          </h2>
          <SearchInput
            searchMode={true}
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
            filters={searchFilters}
            onFilterApply={handleFilterApply}
          />
        </div>
        <MuiTable
          columns={columns}
          rows={rows}
        />
      </div>
    </article>
  );
}
