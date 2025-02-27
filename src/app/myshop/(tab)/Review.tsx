import React, { Suspense, useEffect, useState } from 'react';
import Loading from '@/app/loading';
import ViewTitle from '@/components/layout/ViewTitle';
// import PartnerService from '@/api/service/PartnerService';
import ReviewContents from '@/components/ReviewContents';

interface SettingProps {
  shop: Shop;
}

function Review({ shop }: SettingProps)  {

  // const partnerService = PartnerService();

  const reviewFilterOptions = [
    { label: "最新順", value: "latest" },
    { label: "良い評価順", value: "good" },
    { label: "悪い評価順", value: "worst" }
  ]

  const [reviewFilter, setReviewFilter] = useState<string>(reviewFilterOptions[0].value);
  const [reviewList, setReviewList] = useState<ReviewState[]>([]);

  useEffect(() => {
    const dummyReviewList = [
      { reviewId: '1', userId: 'user1', shopId: shop.shopId, userName: "User1", userProfile: "/assets/img/no-user.jpg", userRatingCount: 1120, userRatingAvg: 4.6, reviewRating: 4, reviewContent: "Good!", createTime: "2024-11-29", shopName: "唐揚げ壱番屋" },
      { reviewId: '2', userId: 'user2', shopId: shop.shopId, userName: "User2", userProfile: "/assets/img/no-user.jpg", userRatingCount: 320, userRatingAvg: 4.9, reviewRating: 5, reviewContent: "Nice!", createTime: "2024-12-29", shopName: "唐揚げ壱番屋" },
      { reviewId: '3', userId: 'user3', shopId: shop.shopId, userName: "User3", userProfile: "/assets/img/no-user.jpg", userRatingCount: undefined, userRatingAvg: undefined, reviewRating: 4, reviewContent: "Good!", createTime: "2024-12-28", shopName: "唐揚げ壱番屋" },
      { reviewId: '4', userId: 'user4', shopId: shop.shopId, userName: "User4", userProfile: "/assets/img/no-user.jpg", userRatingCount: undefined, userRatingAvg: undefined, reviewRating: 4, reviewContent: "Good!", createTime: "2025-01-24", shopName: "唐揚げ壱番屋" },
      { reviewId: '5', userId: 'user5', shopId: shop.shopId, userName: "User5", userProfile: "/assets/img/no-user.jpg", userRatingCount: undefined, userRatingAvg: undefined, reviewRating: 4, reviewContent: "Good!", createTime: "2025-01-24", shopName: "唐揚げ壱番屋" },
    ]
    setReviewList(dummyReviewList as ReviewState[]);
  }, [shop]);

  return (
    <Suspense fallback={<Loading circular />}>
      <div className="tab-contents review">
        <div className="tab-title">
          <ViewTitle
            title="レビュー一覧"
            description="レビュー管理"
          />
        </div>
        <ReviewContents
          className="myshop"
          ratingAvg={shop.ratingAvg || 0}
          reviewCount={shop.reviewCount || 0}
          rating={shop.rating}
          reviewFilter={reviewFilter}
          reviewList={reviewList}
          setReviewFilter={setReviewFilter}
          filterOptions={reviewFilterOptions}
        />
      </div>
    </Suspense>
  );
};

export default React.memo(Review);
