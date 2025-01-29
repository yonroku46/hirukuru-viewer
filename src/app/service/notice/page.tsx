"use client";

import { useEffect, useState } from "react";
import { createKanaSearchRegex } from "@/common/utils/SearchUtils";
import SearchInput from "@/components/input/SearchInput";
import MuiBreadcrumbs from "@/components/mui/MuiBreadcrumbs";
import NoticeCard from "@/components/NoticeCard";

export default function ServiceNoticePage() {
  const breadcrumbs: Breadcrumb[] = [
    { label: 'サービス', href: '/service' },
    { label: 'お知らせ', href: '/service/notice', active: true },
  ];

  const [type, setType] = useState<'all' | ServiceNoticeType['type']>('all');
  const [searchValue, setSearchValue] = useState<string>('');
  const [noticeList, setNoticeList] = useState<ServiceNotice[]>([]);
  const [filteredNoticeList, setFilteredNoticeList] = useState<ServiceNotice[]>([]);

   const searchFilters: SearchFilter[] = [
    { type: 'select', key: 'type', label: '種類', value: type, options: [
      { label: '全て', value: 'all' },
      { label: 'お知らせ', value: 'notice' },
      { label: 'イベント', value: 'event' }
    ]},
  ]

  const handleFilterApply = (updatedFilters: SearchFilter[]) => {
    updatedFilters.forEach(filter => {
      if (filter.key === 'type') {
        setType(filter.value as 'all' | ServiceNoticeType['type']);
      }
    });
  }

  useEffect(() => {
    const dummyNoticeList: ServiceNotice[] = [
      { noticeId: '1', type: 'notice', title: '謹賀新年', description: '2025年もよろしくお願いします', thumbnailImg: 'https://i.pinimg.com/736x/f6/eb/1e/f6eb1e567a5b4827a9afb5195dcab446.jpg', date: '2025-01-01' },
      { noticeId: '2', type: 'notice', title: 'いつでも3%Back!', description: '会員はいつでもポイントバックします', thumbnailImg: 'https://i.pinimg.com/736x/8f/05/4d/8f054d66b37f59a34fd878fc2e783087.jpg', date: '2025-01-02' },
      { noticeId: '3', type: 'event', title: '初めてのガイド', href: '/service/help', description: 'ヒルクルの使い方をご紹介します', thumbnailImg: 'https://i.pinimg.com/736x/19/f1/97/19f197e170d66608885cecb06326b8a7.jpg', date: '2025-01-03' },
      { noticeId: '4', type: 'event', title: 'パートナー募集', href: '/service/partner', description: 'パートナーを募集しています', thumbnailImg: 'https://i.pinimg.com/736x/75/d7/5b/75d75b4a87ea4a45b3dc78e8a30de06d.jpg', date: '2025-01-04' },
      { noticeId: '5', type: 'event', title: 'ランキング', description: '今週のランキングは？', thumbnailImg: 'https://i.pinimg.com/736x/c1/90/a8/c190a833901cfa35fd456012cb9c0f6d.jpg', date: '2025-01-05' },
    ];
    setNoticeList(dummyNoticeList);
  }, []);

  useEffect(() => {
    const filteredNoticeList = noticeList.filter((notice) => {
      const searchRegex = createKanaSearchRegex(searchValue);
      if (type !== 'all' && notice.type !== type) return false;
      return searchRegex.test(notice.title) || searchRegex.test(notice.description);
    });
    setFilteredNoticeList(filteredNoticeList);
  }, [searchValue, noticeList, type]);

  return (
    <div className="service container">
      <MuiBreadcrumbs breadcrumbs={breadcrumbs} />
      <div className="notice-page">
        <div className="title-wrapper">
          <h1 className="title">
            お知らせ
          </h1>
          <p className="description">
            サービスのイベント及びお知らせを掲載しています
          </p>
        </div>
        <div className="search-wrapper">
          <SearchInput
            searchMode
            placeholder="キーワード検索"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            filters={searchFilters}
            onFilterApply={handleFilterApply}
          />
        </div>
        <div className="notice-list">
          {filteredNoticeList.map((notice, index) => (
            <NoticeCard key={index} data={notice} />
          ))}
        </div>
      </div>
    </div>
  );
}