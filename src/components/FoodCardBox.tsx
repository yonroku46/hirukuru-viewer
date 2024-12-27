"use client";

import { DOMAttributes, useCallback, useEffect, useRef, useState } from 'react';
import Slider, { Settings } from 'react-slick';
import { useMediaQuery } from 'react-responsive';
import { useRouter } from 'next/navigation';
import Image from "@/components/Image";
import { currency } from '@/common/utils/StringUtils';

import FavoriteIcon from '@mui/icons-material/Favorite';
import { Box, IconButton } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import Skeleton from '@mui/material/Skeleton';

interface FoodCardBoxProps {
  title: string;
  data: Food[];
}

export default function FoodCardBox({ title, data }: FoodCardBoxProps) {
  const router = useRouter();

  const sliderRef = useRef<Slider>(null);
  const isSp = useMediaQuery({ query: '(max-width: 1179px)' });

  const [favoriteItems, setFavoriteItems] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(1);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isSliderRendering, setIsSliderRendering] = useState<boolean>(true);

  const settings: Settings = {
    dots: false,
    draggable: false,
    arrows: false,
    speed: 400,
    lazyLoad: "ondemand",
    slidesToShow: itemsPerPage,
    slidesToScroll: itemsPerPage,
    onInit: () => {
      setIsSliderRendering(false);
    }
  };

  useEffect(() => {
    setItemsPerPage(isSp ? 2 : 4);
  }, [isSp]);

  const handleFavorite = (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
    e.stopPropagation();
    if (favoriteItems.includes(id)) {
      setFavoriteItems(favoriteItems.filter((item) => item !== id));
    } else {
      setFavoriteItems([...favoriteItems, id]);
    }
  };

  const handlePrev = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isAnimating) return;
    e.stopPropagation();
    setIsAnimating(true);
    const newIndex = Math.max(currentIndex - itemsPerPage, 0);
    setCurrentIndex(newIndex);
    sliderRef.current?.slickPrev();
    setTimeout(() => setIsAnimating(false), 450);
  };

  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isAnimating) return;
    e.stopPropagation();
    setIsAnimating(true);
    const newIndex = Math.min(currentIndex + itemsPerPage, data.length - 1);
    setCurrentIndex(newIndex);
    sliderRef.current?.slickNext();
    setTimeout(() => setIsAnimating(false), 450);
  };

  return (
    <div className="food-card-box">
      <div className='food-card-box-header'>
        <div className='title-wrapper'>
          <h2 className="title">
            {title}
          </h2>
        </div>
        <div className='btn-wrapper'>
          <button className='all-btn'>
            すべて表示
          </button>
          <button
            className={`pc-only prev-btn ${currentIndex > 0 ? 'active' : ''}`}
            onClick={handlePrev}
            disabled={currentIndex === 0}
          >
            <ArrowBackRoundedIcon />
          </button>
          <button
            className={`pc-only next-btn ${currentIndex + itemsPerPage < data.length ? 'active' : ''}`}
            onClick={handleNext}
            disabled={currentIndex + itemsPerPage >= data.length}
          >
            <ArrowForwardRoundedIcon />
          </button>
        </div>
      </div>
      {isSliderRendering &&
        <Box className="food-card-box-content-item">
          <Skeleton variant="rectangular" height={148} />
          <Skeleton />
          <Skeleton width="60%" />
        </Box>
      }
      <Slider ref={sliderRef} {...settings}>
        {data.map((item) => (
          <div
            key={item.id}
            className="food-card-box-content-item"
            onClick={() => router.push(`/bento/${item.id}`)}
          >
            <div className="image-wrapper">
              <Image
                className="image"
                src={item.image}
                alt={item.name}
                width={280}
                height={160}
              />
              <IconButton
                className={`favorite-icon ${favoriteItems.includes(item.id) ? "active" : ""}`}
                onClick={(e) => handleFavorite(e, item.id)}
              >
                <FavoriteIcon />
              </IconButton>
              {item.discountPrice && item.discountPrice < item.price &&
                <div className="sale-tag">
                  {`${Math.round((1 - item.discountPrice / item.price) * 100)}% OFF`}
                </div>
              }
            </div>
            <div className="info-wrapper">
              <div className="info">
                <div className="name">
                  {item.name}
                </div>
                <div className="rating">
                  {item.rating || "-"}
                </div>
              </div>
              {item.discountPrice && item.discountPrice < item.price ?
                <div className="price">
                  <p className="current-price on-sale">
                    {currency(item.discountPrice)}
                    <span className="unit">円</span>
                  </p>
                  <p className="origin-price">
                    {currency(item.price)}
                    <span className="unit">円</span>
                  </p>
                </div>
                :
                <div className="price">
                  <p className="current-price">
                    {currency(item.price)}
                    <span className="unit">円</span>
                  </p>
                </div>
              }
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};