"use client";

import { useState, useEffect, useCallback } from "react";
import { GoogleMap, LoadScript, MarkerClusterer, Marker, InfoWindow } from "@react-google-maps/api";
import { config } from "@/config";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMediaQuery } from "react-responsive";
import { enqueueSnackbar } from "notistack";
import Loading from "@/app/loading";
import Image from "@/components/Image";
import { categoryList, formatRating } from "@/common/utils/StringUtils";
import ShopCard from "@/components/ShopCard";
import MiniButton from "@/components/button/MiniButton";
import LocationDialog from "@/components/LocationDialog";
import FilterButton from "@/components/button/FilterButton";

import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import CloseIcon from "@mui/icons-material/Close";
import MyLocationOutlinedIcon from '@mui/icons-material/MyLocationOutlined';
import ListOutlinedIcon from '@mui/icons-material/ListOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import SellOutlinedIcon from '@mui/icons-material/SellOutlined';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import LocalDiningOutlinedIcon from '@mui/icons-material/LocalDiningOutlined';
import CurrencyYenOutlinedIcon from '@mui/icons-material/CurrencyYenOutlined';
import SortOutlinedIcon from '@mui/icons-material/SortOutlined';

export default function SearchMapPage() {
  const isSp = useMediaQuery({ query: "(max-width: 1179px)" });
  const router = useRouter();
  const searchParams = useSearchParams();
  const c = searchParams.get('c');
  const b = searchParams.get('b');
  const t = searchParams.get('t');
  const s = searchParams.get('s');

  const [favoriteShops, setFavoriteShops] = useState<string[]>([]);
  const [isSale, setIsSale] = useState<boolean>(false);
  const [category, setCategory] = useState<string>(c || "ALL");
  const [budget, setBudget] = useState<string>(b || "ALL");
  const [servingTime, setServingTime] = useState<number | undefined>(t ? Number(t) : undefined);
  const [sortOrder, setSortOrder] = useState<string>(s?.toUpperCase() || "RECOMMEND");
  const [shops, setShops] = useState<Shop[]>([]);
  const [filteredShops, setFilteredShops] = useState<Shop[]>([]);
  const [markPlaces, setMarkPlaces] = useState<Place[]>([]);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [currentPlace, setCurrentPlace] = useState<Place | null>(null);
  const [lastSelectedPosition, setLastSelectedPosition] = useState<PlacePosition | null>(null);
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const [isResultsVisible, setIsResultsVisible] = useState<boolean>(true);
  const [isMapVisible, setIsMapVisible] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(15);
  const [locationDialogOpen, setLocationDialogOpen] = useState<boolean>(false);
  const [userSpot, setUserSpot] = useState<UserSpot | null>(null);

  const handleFavorite = useCallback((e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    e.preventDefault();
    if (favoriteShops.includes(id)) {
      setFavoriteShops(favoriteShops.filter((shopId) => shopId !== id));
    } else {
      setFavoriteShops([...favoriteShops, id]);
    }
  }, [favoriteShops]);

  const toggleResultsVisibility = () => {
    setIsResultsVisible(!isResultsVisible);
  };

  const toggleMapVisibility = () => {
    setIsMapVisible(!isMapVisible);
  };

  const handleCurrentLocation = () => {
    getCurrentLocation();
  };

  const zoomIn = () => {
    if (map) {
      const newZoom = Math.min((map.getZoom() ?? 0) + 1, config.googleMaps.maxZoom);
      map.setZoom(newZoom);
      setZoomLevel(newZoom);
    }
  };

  const zoomOut = () => {
    if (map) {
      const newZoom = Math.max((map.getZoom() ?? 0) - 1, config.googleMaps.minZoom);
      map.setZoom(newZoom);
      setZoomLevel(newZoom);
    }
  };

  const handleCloseInfoWindow = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setActiveMarker(null);
  };

  const handleBoundsChanged = () => {
    if (map) {
      const bounds = map.getBounds();
      if (bounds) {
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        const latDiff = ne.lat() - sw.lat();
        const lngDiff = ne.lng() - sw.lng();

        // console.log(`Current bounds: NE(${ne.lat()}, ${ne.lng()}), SW(${sw.lat()}, ${sw.lng()})`);
        // SELECT * FROM places
        // WHERE latitude BETWEEN :southWestLat AND :northEastLat
        // AND longitude BETWEEN :southWestLng AND :northEastLng;

        // マップのズームレベルに応じて、マーカーの表示を切り替える
        // const largeZoomSize = 0.041;
        const smallZoomSize = 0.025;
        const size = smallZoomSize;
        if (latDiff > size || lngDiff > size) {
          // console.log("Zoom in for a closer view!");
        } else {
          // console.log("OK")
        }
      }
    }
  };

  function activateMarkerForShop(shopId: string) {
    const place = markPlaces.find((p) => p.shopId === shopId);
    if (place) {
      setActiveMarker(place.placeId);
    }
  }

  const getCurrentLocation = useCallback(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userPlace: Place = {
          placeId: "current",
          position: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        };
        setCurrentPlace(userPlace);
        if (map) {
          map.setCenter(userPlace.position);
        }
      },
      (err) => {
        console.error(err.message);
        const defaultPlace: Place = {
          placeId: "default",
          position: config.googleMaps.defaultPosition
        };
        setCurrentPlace(defaultPlace);
        enqueueSnackbar('位置情報を取得に失敗しました。', { variant: 'error' });
      }
    );
  }, [map]);

  useEffect(() => {
    const q = searchParams.get('q');
    const queryParams: Record<string, string> = {};

    if (q) queryParams.q = q;
    if (category && category !== "ALL") queryParams.c = category;
    if (budget && budget !== "ALL") queryParams.b = budget;
    if (servingTime) queryParams.t = servingTime.toString();
    if (sortOrder && sortOrder !== "RECOMMEND") queryParams.s = sortOrder.toLowerCase();

    const queryString = Object.entries(queryParams)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    const url = `/search/map${queryString ? `?${queryString}` : ''}`;
    router.replace(url);
  }, [category, budget, servingTime, sortOrder, router, searchParams]);

  useEffect(() => {
    const dummyShops: Shop[] = [
      { shopId: '1', location: '福岡市博多区', shopName: '唐揚げ壱番屋', shopIntro: '揚げ物専門店', shopType: 'BENTO',
        profileImg: 'https://i.pinimg.com/236x/71/65/43/716543eb8e6907d7163b55000376e2be.jpg',
        thumbnailImg: 'https://i.pinimg.com/236x/71/65/43/716543eb8e6907d7163b55000376e2be.jpg', ratingAvg: 4.5, businessHours: [
          { dayOfWeek: 'MON', openTime: '10:00', closeTime: '23:50', businessDay: true },
          { dayOfWeek: 'TUE', openTime: '10:00', closeTime: '23:50', businessDay: true },
          { dayOfWeek: 'WED', openTime: '10:00', closeTime: '23:50', businessDay: true },
          { dayOfWeek: 'THU', openTime: '10:00', closeTime: '23:50', businessDay: true },
          { dayOfWeek: 'FRI', openTime: '10:00', closeTime: '23:50', businessDay: true },
          { dayOfWeek: 'SAT', openTime: '10:00', closeTime: '23:50', businessDay: true },
          { dayOfWeek: 'SUN', openTime: '10:00', closeTime: '23:50', businessDay: true },
        ]
      },
      { shopId: '2', location: '福岡市中央区', shopName: 'チキンが一番', shopIntro: 'チキン専門店', shopType: 'BENTO',
        profileImg: 'https://i.pinimg.com/236x/71/65/43/716543eb8e6907d7163b55000376e2be.jpg',
        thumbnailImg: 'https://i.pinimg.com/736x/d2/bb/52/d2bb52d3639b77f024c8b5a584949644.jpg', ratingAvg: 4.0, businessHours: [
          { dayOfWeek: 'MON', openTime: '10:00', closeTime: '20:00', businessDay: true },
          { dayOfWeek: 'WED', openTime: '10:00', closeTime: '20:00', businessDay: true },
        ]
      },
      { shopId: '3', location: '福岡市中央区', shopName: 'Chiken Box', shopIntro: 'フードトラックで美味しいチキン', shopType: 'FOOD_TRUCK',
        profileImg: 'https://i.pinimg.com/236x/71/65/43/716543eb8e6907d7163b55000376e2be.jpg',
        thumbnailImg: 'https://i.pinimg.com/736x/44/75/35/44753517c49efeff49e77071cc306041.jpg', ratingAvg: 4.0, businessHours: [
          { dayOfWeek: 'MON', openTime: '10:00', closeTime: '20:00', businessDay: true },
          { dayOfWeek: 'WED', openTime: '10:00', closeTime: '20:00', businessDay: true },
        ]
      },
      { shopId: '4', location: '福岡市中央区', shopName: '天神トラック', shopIntro: '天神で自慢のランチ', shopType: 'FOOD_TRUCK',
        profileImg: 'https://i.pinimg.com/236x/71/65/43/716543eb8e6907d7163b55000376e2be.jpg',
        thumbnailImg: 'https://i.pinimg.com/736x/64/70/a6/6470a637276c688063bb053c5c116507.jpg', ratingAvg: 4.0, businessHours: [
          { dayOfWeek: 'MON', openTime: '10:00', closeTime: '20:00', businessDay: true },
          { dayOfWeek: 'WED', openTime: '10:00', closeTime: '20:00', businessDay: true },
        ]
      },
      { shopId: '5', location: '福岡市中央区', shopName: '田島春', shopIntro: 'カレー専門店', shopType: 'FOOD_TRUCK',
        profileImg: 'https://i.pinimg.com/236x/71/65/43/716543eb8e6907d7163b55000376e2be.jpg',
        thumbnailImg: 'https://i.pinimg.com/736x/57/53/14/575314964f78cc3d80968427e55a4ebf.jpg', ratingAvg: 4.0, businessHours: [
          { dayOfWeek: 'MON', openTime: '10:00', closeTime: '20:00', businessDay: true },
          { dayOfWeek: 'WED', openTime: '10:00', closeTime: '20:00', businessDay: true },
        ]
      },
      { shopId: '6', location: '福岡市中央区', shopName: '肉弁や', shopIntro: '肉が一番', shopType: 'BENTO',
        profileImg: 'https://i.pinimg.com/236x/71/65/43/716543eb8e6907d7163b55000376e2be.jpg',
        thumbnailImg: 'https://i.pinimg.com/736x/56/38/5d/56385dd21968602af62ce30156914743.jpg', ratingAvg: 4.0, businessHours: [
          { dayOfWeek: 'MON', openTime: '10:00', closeTime: '20:00', businessDay: true },
          { dayOfWeek: 'WED', openTime: '10:00', closeTime: '20:00', businessDay: true },
        ]
      },
    ];
    const dummyPlaces = [
      { placeId: "P1", shopId: "1", position: { lat: 33.5902, lng: 130.4017 } },
      { placeId: "P2", shopId: "2", position: { lat: 33.5898, lng: 130.4100 } },
      { placeId: "P3", shopId: "3", position: { lat: 33.5869, lng: 130.4100 } },
      { placeId: "P4", shopId: "4", position: { lat: 33.5847, lng: 130.4102 } },
      { placeId: "P5", shopId: "5", position: { lat: 33.5842, lng: 130.4102 } },
      { placeId: "P6", shopId: "6", position: { lat: 33.5847, lng: 130.4105 } },
    ];
    const dummyUserSpot: UserSpot = {
      spotId: "1",
      userId: "1",
      spotName: "マイスポット",
      latitude: 33.5902,
      longitude: 130.4017,
      accuracy: 0,
    };
    setShops(dummyShops);
    setFilteredShops(dummyShops);
    setMarkPlaces(dummyPlaces);
    setUserSpot(dummyUserSpot);
    getCurrentLocation();
  }, [getCurrentLocation]);

  useEffect(() => {
    if (servingTime) {
      setFilteredShops(
        shops.filter(shop => {
          if (shop.servingMinutes) {
            return (shop.servingMinutes <= servingTime);
          }
          return true;
        })
      );
    }
  }, [shops, servingTime]);

  useEffect(() => {
    if (isSp && isMapVisible) {
      window.scrollTo({
        top: 0,
      });
    }
  }, [isSp, isMapVisible]);

  useEffect(() => {
    if (isSp) {
      setIsMapVisible(true);
    }
  }, [isSp]);

  return (
    <article>
      <div className="search-map-page">
        <div className="content-header">
          <div className="filter-container container">
            <LocationDialog
              spot={userSpot}
              open={locationDialogOpen}
              onClose={() => {
                setLocationDialogOpen(false);
              }}
            />
            <div className="btn-wrapper">
              <FilterButton
                icon={<SellOutlinedIcon />}
                label="割引中"
                active={isSale}
                onClick={() => setIsSale(!isSale)}
              />
            </div>
            <div className="filter-wrapper">
              <FilterButton
                icon={<LocalDiningOutlinedIcon />}
                label="カテゴリー"
                options={categoryList.map((item) => ({
                  label: item.name,
                  value: item.name,
                  selected: category.includes(item.name)
                }))}
                optionMultiple
                active={category !== "ALL"}
                onApply={(value) => {
                  setCategory(value);
                }}
                onReset={() => {
                  setCategory("ALL");
                }}
              />
              <FilterButton
                icon={<CurrencyYenOutlinedIcon />}
                label="予算"
                options={[
                  { label: "~500円", value: "500", selected: budget === "500" },
                  { label: "~1000円", value: "1000", selected: budget === "1000" },
                  { label: "~1500円", value: "1500", selected: budget === "1500" },
                  { label: "~2000円", value: "2000", selected: budget === "2000" },
                  { label: "3000円~", value: "3000", selected: budget === "3000" }
                ]}
                active={budget !== "ALL"}
                onApply={(value) => {
                  setBudget(value as "ALL" | "500" | "1000" | "1500" | "2000" | "3000");
                }}
                onReset={() => {
                  setBudget("ALL");
                }}
              />
              <FilterButton
                icon={<TimerOutlinedIcon />}
                label="受取時間"
                active={servingTime !== undefined}
                options={[
                  { label: "10分以内に受け取り", value: "10", selected: servingTime === 10 },
                  { label: "20分以内に受け取り", value: "20", selected: servingTime === 20 },
                  { label: "30分以内に受け取り", value: "30", selected: servingTime === 30 }
                ]}
                onApply={(value) => {
                  setServingTime(Number(value));
                }}
                onReset={() => {
                  setServingTime(undefined);
                }}
              />
              <FilterButton
                icon={<SortOutlinedIcon />}
                label="並び替え"
                options={[
                  { label: "おすすめ順", value: "RECOMMEND", selected: sortOrder === "RECOMMEND" },
                  { label: "いい評価順", value: "RATING", selected: sortOrder === "RATING" },
                  { label: "新着順", value: "LATEST", selected: sortOrder === "LATEST" }
                ]}
                active={sortOrder !== "RECOMMEND"}
                onApply={(value) => {
                  setSortOrder(value as "RECOMMEND" | "RATING" | "LATEST");
                }}
                onReset={() => {
                  setSortOrder("RECOMMEND");
                }}
              />
            </div>
          </div>
        </div>
        <div className={`content-body ${isSp && isMapVisible ? "open" : "close"}`}>
          {/* Search Results */}
          {isResultsVisible && (
            <div className={`results ${isSp && isMapVisible ? "open" : "close"}`}>
              <div className="results-wrapper">
                <div>
                  検索結果
                  <span className="count">
                    {filteredShops.length}
                  </span>
                  件
                </div>
                {isSp && !isMapVisible && (
                  <MiniButton
                    className="sp-map-btn"
                    icon={<MapOutlinedIcon />}
                    onClick={toggleMapVisibility}
                    label="マップ表示"
                  />
                )}
              </div>
              <div className="results-list">
                {filteredShops.map((shop, index) => (
                  <ShopCard
                    key={index}
                    data={shop}
                    href={`/shop/${shop.shopId}`}
                    openNewTab
                    onHover={() => activateMarkerForShop(shop.shopId)}
                    onClick={() => activateMarkerForShop(shop.shopId)}
                    isFavorite={favoriteShops.includes(shop.shopId)}
                    handleFavorite={handleFavorite}
                  />
                ))}
              </div>
            </div>
          )}
          {/* Google Map */}
          <div className={`map ${isSp && isMapVisible ? "open" : "close"}`}>
            <button className="toggle-results-btn" onClick={toggleResultsVisibility}>
              <KeyboardArrowRightIcon className={`arrow-icon ${isResultsVisible ? "open" : "close"}`} />
              {!isResultsVisible &&
                <span className="text">
                  リスト表示
                </span>
              }
            </button>
            {isSp && isMapVisible && (
              <>
                <MiniButton
                  className="sp-current-btn"
                  icon={<MyLocationOutlinedIcon />}
                  onClick={handleCurrentLocation}
                />
                <MiniButton
                  className="sp-list-btn"
                  icon={<ListOutlinedIcon />}
                  onClick={toggleMapVisibility}
                  label="リスト表示"
                />
              </>
            )}
            <div className="zoom-btn-group">
              <button className={`zoom-btn zoom-in ${zoomLevel >= config.googleMaps.maxZoom ? 'over' : ''}`} onClick={zoomIn}>
                <AddIcon />
              </button>
              <button className={`zoom-btn zoom-out ${zoomLevel <= config.googleMaps.minZoom ? 'over' : ''}`} onClick={zoomOut}>
                <RemoveIcon />
              </button>
              <MiniButton
                className="current-btn"
                icon={<MyLocationOutlinedIcon />}
                onClick={handleCurrentLocation}
              />
            </div>
            <LoadScript
              googleMapsApiKey={config.googleMaps.apiKey}
              loadingElement={<Loading />}
            >
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100%" }}
                onLoad={(mapInstance) => {
                  setMap(mapInstance);
                  // クリック時のデフォルトの情報ウィンドウを非表示
                  mapInstance.addListener("click", (e: google.maps.MapMouseEvent) => {
                    e.stop();
                  });
                }}
                onBoundsChanged={handleBoundsChanged}
                onZoomChanged={() => {
                  if (map) {
                    setZoomLevel(map.getZoom() ?? 15);
                  }
                }}
                onClick={() => setActiveMarker(null)}
                center={lastSelectedPosition || currentPlace?.position}
                zoom={zoomLevel}
                options={config.googleMaps.options}
              >
                {currentPlace?.position && (
                  <Marker
                    position={currentPlace?.position}
                    icon={`/assets/icon/user-marker.svg`}
                  />
                )}
                <MarkerClusterer
                  options={{
                    gridSize: 50,
                    minimumClusterSize: 3,
                    styles: [
                      {
                        url: '/assets/icon/marker-cluster.svg',
                        height: 40,
                        width: 40,
                        textColor: 'var(--background)',
                        textSize: 12,
                      },
                      {
                        url: '/assets/icon/marker-cluster.svg',
                        height: 50,
                        width: 50,
                        textColor: 'var(--background)',
                        textSize: 14,
                      },
                      {
                        url: '/assets/icon/marker-cluster.svg',
                        height: 60,
                        width: 60,
                        textColor: 'var(--background)',
                        textSize: 18,
                      },
                    ],
                  }}
                >
                {(clusterer) => (
                  <>
                    {markPlaces.map((place, index) => {
                      const shop = shops.find((s) => s.shopId === place.shopId);
                      if (!shop) return null;
                      return (
                        <Marker
                          key={index}
                          position={place.position}
                          icon={{
                            url: `/assets/icon/${shop.shopType.toLowerCase()}-marker.svg`,
                            scaledSize: new google.maps.Size(
                              activeMarker === place.placeId ? 44 : 34,
                              activeMarker === place.placeId ? 44 : 34
                            )
                          }}
                          clusterer={clusterer}
                          onClick={() => {
                            setActiveMarker(place.placeId);
                            setLastSelectedPosition(place.position);
                          }}
                          onMouseOver={() => {
                            setActiveMarker(place.placeId);
                          }}
                        >
                          {activeMarker === place.placeId && shop && (
                            <InfoWindow
                              onDomReady={() => {
                                const infoWindowElement = document.querySelector('.info-window');
                                if (infoWindowElement) {
                                  infoWindowElement.addEventListener('wheel', (e) => e.preventDefault());
                                }
                              }}
                            >
                              <Link href={`/shop/${shop.shopId}`} target="_blank">
                                <div className="info-window">
                                  <div className="info-image">
                                    <Image src={shop.thumbnailImg} alt={shop.shopName} width={220} height={120} />
                                    <div className="close-btn-wrapper" onClick={handleCloseInfoWindow}>
                                      <button className="close-btn">
                                        <CloseIcon fontSize="small" />
                                      </button>
                                    </div>
                                  </div>
                                  <div className="info-content">
                                    <div className="shop-title">
                                      {shop.shopName}
                                      <div className="shop-rating">
                                        <StarRoundedIcon fontSize="small" style={{ color: 'var(--rating-color)' }} />
                                        <span>{formatRating(shop.ratingAvg || 0)}</span>
                                      </div>
                                    </div>
                                    <div className="shop-description">
                                      {shop.shopIntro}
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            </InfoWindow>
                          )}
                        </Marker>
                      );
                    })}
                  </>
                )}
                </MarkerClusterer>
              </GoogleMap>
            </LoadScript>
          </div>
        </div>
      </div>
    </article>
  );
}