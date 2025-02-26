"use client";

import { useMemo } from 'react';
import dayjs from 'dayjs';
import { currency, formatDaysAgo, formatRating } from '@/common/utils/StringUtils';
import Selector from '@/components/input/Selector';
import Image from "@/components/Image";

import StarRoundedIcon from '@mui/icons-material/StarRounded';
import Rating from '@mui/material/Rating';
import MarkChatReadOutlinedIcon from '@mui/icons-material/MarkChatReadOutlined';

interface ReviewContentsProps {
  className?: string;
  ratingAvg: number;
  reviewCount: number;
  rating: Shop['rating'];
  reviewFilter: string;
  reviewList: ReviewState[];
  setReviewFilter: (filter: string) => void;
  filterOptions: { label: string; value: string }[];
}

export default function ReviewContents({ className, ratingAvg, reviewCount, rating, reviewFilter, reviewList, setReviewFilter, filterOptions }: ReviewContentsProps) {

  const sortedReviewList = useMemo(() => {
    return reviewList.sort((a, b) => {
      const dateA = dayjs(a.createTime).unix();
      const dateB = dayjs(b.createTime).unix();
      // 最新順
      if (reviewFilter === 'latest') {
        return dateB - dateA;
      }
      // 良い評価順 + 最新順
      if (reviewFilter === 'good') {
        return b.reviewRating - a.reviewRating || dateB - dateA;
      }
      // 悪い評価順 + 最新順
      if (reviewFilter === 'worst') {
        return a.reviewRating - b.reviewRating || dateB - dateA;
      }
      return 0;
    });
  }, [reviewFilter, reviewList]);

  return (
    <div className={`review-contents ${className}`}>
      <div className="review-wrapper">
        {/* Review Summary */}
        <div className="review-summary">
          <h2 className="total-rating">
            <StarRoundedIcon style={{ color: 'var(--rating-color)' }} />
            {`${formatRating(ratingAvg)}`}
            <span className="review-count">
              {`(${currency(reviewCount)}個の評価)`}
            </span>
          </h2>
          <div className="rating-distribution">
            {Array.from({ length: 5 }, (_, index) => {
              const star: string = (5 - index).toString();
              const ratingValue = rating?.[star as keyof typeof rating];
              const percentage = ratingValue ? ratingValue.toFixed(0) : "0";
              return (
                <div className="rating-bar" key={star}>
                  <span>{star}</span>
                  <div className="bar-background">
                    <div className="bar" style={{ width: `${percentage}%` }} />
                  </div>
                  <span className="percentage">{`${percentage}%`}</span>
                </div>
              );
            })}
          </div>
        </div>
        {/* Review List */}
        <div className="review-list">
          {sortedReviewList.length > 0 ?
            <>
              <div className="review-filter">
                <Selector
                  options={filterOptions}
                  value={reviewFilter}
                  onChange={(e) => setReviewFilter(e.target.value)}
                />
              </div>
              <ul>
                {sortedReviewList.map((review, index) => (
                  <li key={index} className="review-item">
                    <div className="review-content">
                      <div className="review-title">
                        <div className="review-user">
                          <Image
                            className="review-profile"
                            src={review.userProfile}
                            alt={review.userName}
                            width={36}
                            height={36}
                          />
                          <div className="review-user-info">
                            <div className="review-user-name-rating">
                              <div className="user-name">
                                {review.userName}
                              </div>
                              <div className="user-rating">
                                {`評価 ${currency(review.userRatingCount || 0)} ・ 平均 ${review.userRatingAvg || 0}`}
                              </div>
                            </div>
                            <Rating
                              readOnly
                              size="small"
                              value={review.reviewRating}
                              icon={<StarRoundedIcon fontSize="inherit" style={{ color: 'var(--rating-color)' }} />}
                              emptyIcon={<StarRoundedIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                            />
                          </div>
                        </div>
                        <div className="review-date">
                          {formatDaysAgo(review.createTime)}
                        </div>
                      </div>
                      <p>
                        {review.reviewContent}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </>
            :
            <div className="no-review">
              <MarkChatReadOutlinedIcon fontSize="large" />
              皆さんの評価をお待ちしております
            </div>
          }
        </div>
      </div>
    </div>
  );
};