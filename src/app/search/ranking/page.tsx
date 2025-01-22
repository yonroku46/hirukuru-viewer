"use client";

export default function SearchRankingPage() {
  return (
    <div className="search-ranking-page">
      <div className="container">
        <div className="content-header">
          <div className="title-wrapper">
            <h1>地域別</h1>
            <h1>ランキング</h1>
          </div>
          <div className="description-wrapper">
            <p>
              地域別ランキングは、お客様の地域にある弁当屋さんや店舗のランキングです。
            </p>
          </div>
        </div>
        <div className="content-body">
          <div className="ranking-list">
            <div className="ranking-item">
              <div className="ranking-item-title">
                <h1>1位</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}