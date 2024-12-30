"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import SearchInput from "@/components/SearchInput";
import { currency, formatDaysAgo } from "@/common/utils/StringUtils";
import MuiMenu from "@/components/mui/MuiMenu";
import MuiTabs from "@/components/mui/MuiTabs";
import Selecter from "@/components/Selecter";

import IconButton from "@mui/material/IconButton";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';
import Rating from '@mui/material/Rating';
import StarRoundedIcon from '@mui/icons-material/StarRounded';

export default function ShopInfoPage(
  { params: { shopId } }: { params: { shopId: string } }
) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get('q');

  const [searchValue, setSearchValue] = useState<string>('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [reviewFilter, setReviewFilter] = useState<string>('latest');

  useEffect(() => {
    if (q) {
      setSearchValue(q);
    }
  }, [q]);

  const shopInfo = {
    id: 1,
    name: '唐揚げ壱番屋',
    description: '揚げ物専門店',
    image: 'https://i.pinimg.com/236x/71/65/43/716543eb8e6907d7163b55000376e2be.jpg',
    reviewcount: 1120,
    ratingAvg: 4.5,
    rating: {
      "1": 2,
      "2": 8,
      "3": 10,
      "4": 25,
      "5": 55
    }
  };
  const bentoInfo = {
    id: 1,
    name: '唐揚げ弁当',
    description: 'さくさく天ぷらを載せた世界一美味しい弁当です',
    price: 1000,
    discountPrice: 950,
    rating: 4.5,
    reviewcount: 124,
    thumbnail: 'https://i.pinimg.com/736x/f2/67/df/f267dfdd2b0cb8eac4b5e9674aa49e97.jpg',
  };
  const tabs = [
    {
      label: "おすすめ・特価",
      panel:
        <div className="shop-item">
          <div className="shop-item-header">
            <SearchInput
              searchMode={true}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        </div>
    },
    {
      label: "全メニュー",
      panel:
        <div className="shop-item">
          期間限定
        </div>
    },
    {
      label: "カテゴリー1",
      panel:
        <div className="shop-item">
          カテゴリー1
        </div>
    },
    {
      label: "カテゴリー2",
      panel:
        <div className="shop-item">
          カテゴリー2
        </div>
    },
    {
      label: "カテゴリー3",
      panel:
        <div className="shop-item">
          カテゴリー3
        </div>
    }
  ];
  const reviewFilterOptions = [
    {
      label: "最新順",
      value: "latest"
    },
    {
      label: "良い評価順",
      value: "good"
    },
    {
      label: "悪い評価順",
      value: "worst"
    }
  ]
  const reviewList = [
    {
      id: 1,
      user: "User1",
      userProfile: "/assets/img/no-user.jpg",
      userRatingCount: 1120,
      userRatingAvg: 4.6,
      rating: 4,
      date: "2024-11-29",
      comment: "Good!"
    },
    {
      id: 2,
      user: "User2",
      userProfile: "/assets/img/no-user.jpg",
      userRatingCount: 320,
      userRatingAvg: 4.9,
      rating: 5,
      date: "2024-12-29",
      comment: "Nice!"
    },
    {
      id: 3,
      user: "User3",
      userProfile: "/assets/img/no-user.jpg",
      userRatingCount: 120,
      userRatingAvg: 4.2,
      rating: 4,
      date: "2024-12-28",
      comment: "Good!"
    }
  ];

  const handleOrder = () => {
    console.log(`注文`);
  };

  const handleMore = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const sortedReviewList = useMemo(() => {
    return reviewList.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();

      // 最新順
      if (reviewFilter === 'latest') {
        return dateB - dateA;
      }
      // 良い評価順 + 最新順
      if (reviewFilter === 'good') {
        return b.rating - a.rating || dateB - dateA;
      }
      // 悪い評価順 + 最新順
      if (reviewFilter === 'worst') {
        return a.rating - b.rating || dateB - dateA;
      }
      return 0;
    });
  }, [reviewFilter]);

  return (
    <article className="bento">
      {/* Shop Info */}
      <section className="shop-header">
        <div className="shop-profile container">
          <Image
            className="profile-img"
            src={shopInfo.image}
            alt={shopInfo.name}
            width={74}
            height={74}
          />
          <div className="shop-action-wrapper">
            <IconButton className="action-btn">
              <FmdGoodOutlinedIcon />
            </IconButton>
            <IconButton className="action-btn">
              <FavoriteBorderIcon />
            </IconButton>
            <IconButton className="action-btn" onClick={handleMore}>
              <MoreHorizIcon />
            </IconButton>
          </div>
        </div>
        <MuiMenu anchorEl={anchorEl} setAnchorEl={setAnchorEl} />
      </section>
      {/* Shop Menu & Items */}
      <section className="shop-body container">
        <div className="shop-info">
          <div className="shop-info-header">
            <h1 className="shop-name">{shopInfo.name}</h1>
            <h2 className="shop-description">{shopInfo.description}</h2>
          </div>
          <p className="shop-rating">
            <StarRoundedIcon fontSize="small" style={{ color: 'var(--rating-color)' }} />
            {`${shopInfo.ratingAvg} (${currency(shopInfo.reviewcount)})`}
          </p>
        </div>
        <MuiTabs tabs={tabs} />
      </section>
      {/* Review */}
      <section className="shop-review container">
        <div className="shop-review-content">
          <div className="review-summary">
            <h2 className="total-rating">
              <StarRoundedIcon style={{ color: 'var(--rating-color)' }} />
              {`${4.5}`}
              <span className="review-count">
                {`(${currency(shopInfo.reviewcount)}個の評価)`}
              </span>
            </h2>
            <div className="rating-distribution">
              {Array.from({ length: 5 }, (_, index) => {
                const star: string = (5 - index).toString();
                const percentage = shopInfo.rating[star as keyof typeof shopInfo.rating].toFixed(0);
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
          <div className="review-list">
            <div className="review-filter">
              <Selecter
                options={reviewFilterOptions}
                onChange={(e) => setReviewFilter(e.target.value)}
              />
            </div>
            <ul>
              {sortedReviewList.map((review) => (
                <li className="review-item" key={review.id}>
                  <div className="review-content">
                    <div className="review-title">
                      <div className="review-user">
                        <Image
                          className="review-profile"
                          src={review.userProfile}
                          alt={review.user}
                          width={36}
                          height={36}
                        />
                        <div className="review-user-info">
                          <div className="review-user-name-rating">
                            <div className="user-name">
                              {review.user}
                            </div>
                            <div className="user-rating">
                              {`評価 ${currency(review.userRatingCount)} ・ 平均 ${review.userRatingAvg}`}
                            </div>
                          </div>
                          <Rating
                            readOnly
                            size="small"
                            value={review.rating}
                            icon={<StarRoundedIcon fontSize="inherit" style={{ color: 'var(--rating-color)' }} />}
                            emptyIcon={<StarRoundedIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                          />
                        </div>
                      </div>
                      <div className="review-date">
                        {formatDaysAgo(review.date)}
                      </div>
                    </div>
                    <p>
                      {review.comment}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </article>
  );
}