"use client";

import { useEffect, useState } from "react";
import SearchInput from "@/components/input/SearchInput";
import MuiBreadcrumbs from "@/components/mui/MuiBreadcrumbs";
import NoticeCard from "@/components/NoticeCard";

import SearchOffIcon from '@mui/icons-material/SearchOff';
import Pagination from '@mui/material/Pagination';

export default function ServiceNoticePage() {
  const breadcrumbs: Breadcrumb[] = [
    { label: 'サービス', href: '/service' },
    { label: 'お知らせ', href: '/service/notice', active: true },
  ];

  const [searchValue, setSearchValue] = useState<string>('');
  const [noticeList, setNoticeList] = useState<ServiceNotice[]>([]);
  const [page, setPage] = useState<number>(1);
  const perPage = 9;

  const handleChange = (e: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  useEffect(() => {
    const dummyNoticeList: ServiceNotice[] = [
      { noticeId: '1', noticeType: 'NOTICE', noticeTitle: '謹賀新年', noticeDetail: '2025年もよろしくお願いします', thumbnailImg: 'https://i.pinimg.com/736x/f6/eb/1e/f6eb1e567a5b4827a9afb5195dcab446.jpg', createTime: '2025-01-01' },
      { noticeId: '2', noticeType: 'NOTICE', noticeTitle: 'いつでもBack!', noticeDetail: '会員はいつでもポイントバックします', thumbnailImg: 'https://i.pinimg.com/736x/8f/05/4d/8f054d66b37f59a34fd878fc2e783087.jpg', createTime: '2025-01-02' },
      { noticeId: '3', noticeType: 'EVENT', noticeTitle: '初めてのガイド', noticeHref: '/service/help', noticeDetail: 'ヒルクルの使い方をご紹介します', thumbnailImg: 'https://i.pinimg.com/736x/19/f1/97/19f197e170d66608885cecb06326b8a7.jpg', createTime: '2025-01-03' },
      { noticeId: '4', noticeType: 'EVENT', noticeTitle: 'パートナー募集', noticeHref: '/service/partner', noticeDetail: 'パートナーを募集しています', thumbnailImg: 'https://i.pinimg.com/736x/75/d7/5b/75d75b4a87ea4a45b3dc78e8a30de06d.jpg', createTime: '2025-01-04' },
      { noticeId: '5', noticeType: 'EVENT', noticeTitle: 'ランキング', noticeDetail: '今週のランキングは？', thumbnailImg: 'https://i.pinimg.com/736x/c1/90/a8/c190a833901cfa35fd456012cb9c0f6d.jpg', createTime: '2025-01-05' },
    ];
    setNoticeList(dummyNoticeList);
  }, []);

  return (
    <article>
      <div className="background" />
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
            />
          </div>
          {noticeList.length > 0 ?
            <div className="notice-list">
              {noticeList.slice((page - 1) * perPage, page * perPage).map((notice, index) => (
                <NoticeCard key={index} data={notice} />
              ))}
            </div>
          :
            <div className="notice-list empty">
              <SearchOffIcon fontSize="large" />
              表示するコンテンツがありません
            </div>
          }
          <div className="pagination-wrapper">
            <Pagination
              count={Math.ceil(noticeList.length / perPage)}
              shape="rounded"
              page={page}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </article>
  );
}