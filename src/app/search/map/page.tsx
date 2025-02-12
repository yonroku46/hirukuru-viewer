"use client";

import { useState, useEffect, useCallback } from "react";
import { GoogleMap, LoadScript, MarkerClusterer, Marker, InfoWindow } from "@react-google-maps/api";
import { config } from "@/config";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";
import { enqueueSnackbar } from "notistack";
import Loading from "@/app/loading";
import Image from "@/components/Image";
import { isBusinessOpen } from "@/common/utils/DateUtils";
import { formatRating } from "@/common/utils/StringUtils";
import ShopCard from "@/components/ShopCard";
import Selector from "@/components/input/Selector";
import SwitchButton from "@/components/button/SwitchButton";
import MiniButton from "@/components/button/MiniButton";

import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import CloseIcon from "@mui/icons-material/Close";
import MyLocationOutlinedIcon from '@mui/icons-material/MyLocationOutlined';
import ListOutlinedIcon from '@mui/icons-material/ListOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const defaultPosition = {
  lat: 33.5902,
  lng: 130.4017
};
const maxZoom = 20;
const minZoom = 5;
const googleMapOptions = {
  maxZoom: maxZoom,
  minZoom: minZoom,
  scrollwheel: true,
  mapTypeControl: false,
  fullscreenControl: false,
  streetViewControl: false,
  zoomControl: false,
  keyboardShortcuts: false,
  gestureHandling: "greedy",
  styles: [
    {
      "elementType": "labels",
      "stylers": [{ "saturation": -15 }, { "lightness": 20 }]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels",
      "stylers": [{ "visibility": "off" }]
    },
    {
      "featureType": "poi.business",
      "stylers": [{ "visibility": "simplified" }]
    },
    {
      "featureType": "road.local",
      "elementType": "labels",
      "stylers": [{ "visibility": "off" }]
    }
  ]
};

export default function SearchMapPage() {
  const isSp = useMediaQuery({ query: "(max-width: 1179px)" });

  const [favoriteShops, setFavoriteShops] = useState<string[]>([]);
  const [openOnly, setOpenOnly] = useState<boolean>(false);
  const [shopType, setShopType] = useState<"ALL" | ShopType["type"]>("ALL");
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
      const newZoom = Math.min((map.getZoom() ?? 0) + 1, maxZoom);
      map.setZoom(newZoom);
      setZoomLevel(newZoom);
    }
  };

  const zoomOut = () => {
    if (map) {
      const newZoom = Math.max((map.getZoom() ?? 0) - 1, minZoom);
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
          position: defaultPosition
        };
        setCurrentPlace(defaultPlace);
        enqueueSnackbar('位置情報を取得に失敗しました。', { variant: 'error' });
      }
    );
  }, [map]);

  useEffect(() => {
    const dummyShops: Shop[] = [
      { shopId: '1', location: '福岡市博多区', shopName: '唐揚げ壱番屋', shopIntro: '揚げ物専門店', shopType: 'BENTO',
        profileImg: 'https://i.pinimg.com/236x/71/65/43/716543eb8e6907d7163b55000376e2be.jpg',
        thumbnailImg: 'https://i.pinimg.com/236x/71/65/43/716543eb8e6907d7163b55000376e2be.jpg', ratingAvg: 4.5, businessHours: [
          { dayOfWeek: 'mon', openTime: '10:00', closeTime: '23:50', businessDay: true },
          { dayOfWeek: 'tue', openTime: '10:00', closeTime: '23:50', businessDay: true },
          { dayOfWeek: 'wed', openTime: '10:00', closeTime: '23:50', businessDay: true },
          { dayOfWeek: 'thu', openTime: '10:00', closeTime: '23:50', businessDay: true },
          { dayOfWeek: 'fri', openTime: '10:00', closeTime: '23:50', businessDay: true },
          { dayOfWeek: 'sat', openTime: '10:00', closeTime: '23:50', businessDay: true },
          { dayOfWeek: 'sun', openTime: '10:00', closeTime: '23:50', businessDay: true },
        ]
      },
      { shopId: '2', location: '福岡市中央区', shopName: 'チキンが一番', shopIntro: 'チキン専門店', shopType: 'BENTO',
        profileImg: 'https://i.pinimg.com/236x/71/65/43/716543eb8e6907d7163b55000376e2be.jpg',
        thumbnailImg: 'https://i.pinimg.com/736x/d2/bb/52/d2bb52d3639b77f024c8b5a584949644.jpg', ratingAvg: 4.0, businessHours: [
          { dayOfWeek: 'mon', openTime: '10:00', closeTime: '20:00', businessDay: true },
          { dayOfWeek: 'wed', openTime: '10:00', closeTime: '20:00', businessDay: true },
        ]
      },
      { shopId: '3', location: '福岡市中央区', shopName: 'Chiken Box', shopIntro: 'フードトラックで美味しいチキン', shopType: 'FOOD_TRUCK',
        profileImg: 'https://i.pinimg.com/236x/71/65/43/716543eb8e6907d7163b55000376e2be.jpg',
        thumbnailImg: 'https://i.pinimg.com/736x/44/75/35/44753517c49efeff49e77071cc306041.jpg', ratingAvg: 4.0, businessHours: [
          { dayOfWeek: 'mon', openTime: '10:00', closeTime: '20:00', businessDay: true },
          { dayOfWeek: 'wed', openTime: '10:00', closeTime: '20:00', businessDay: true },
        ]
      },
      { shopId: '4', location: '福岡市中央区', shopName: '天神トラック', shopIntro: '天神で自慢のランチ', shopType: 'FOOD_TRUCK',
        profileImg: 'https://i.pinimg.com/236x/71/65/43/716543eb8e6907d7163b55000376e2be.jpg',
        thumbnailImg: 'https://i.pinimg.com/736x/64/70/a6/6470a637276c688063bb053c5c116507.jpg', ratingAvg: 4.0, businessHours: [
          { dayOfWeek: 'mon', openTime: '10:00', closeTime: '20:00', businessDay: true },
          { dayOfWeek: 'wed', openTime: '10:00', closeTime: '20:00', businessDay: true },
        ]
      },
      { shopId: '5', location: '福岡市中央区', shopName: '田島春', shopIntro: 'カレー専門店', shopType: 'FOOD_TRUCK',
        profileImg: 'https://i.pinimg.com/236x/71/65/43/716543eb8e6907d7163b55000376e2be.jpg',
        thumbnailImg: 'https://i.pinimg.com/736x/57/53/14/575314964f78cc3d80968427e55a4ebf.jpg', ratingAvg: 4.0, businessHours: [
          { dayOfWeek: 'mon', openTime: '10:00', closeTime: '20:00', businessDay: true },
          { dayOfWeek: 'wed', openTime: '10:00', closeTime: '20:00', businessDay: true },
        ]
      },
      { shopId: '6', location: '福岡市中央区', shopName: '肉弁や', shopIntro: '肉が一番', shopType: 'BENTO',
        profileImg: 'https://i.pinimg.com/236x/71/65/43/716543eb8e6907d7163b55000376e2be.jpg',
        thumbnailImg: 'https://i.pinimg.com/736x/56/38/5d/56385dd21968602af62ce30156914743.jpg', ratingAvg: 4.0, businessHours: [
          { dayOfWeek: 'mon', openTime: '10:00', closeTime: '20:00', businessDay: true },
          { dayOfWeek: 'wed', openTime: '10:00', closeTime: '20:00', businessDay: true },
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
    setShops(dummyShops);
    setFilteredShops(dummyShops);
    setMarkPlaces(dummyPlaces);
    getCurrentLocation();
  }, [getCurrentLocation]);

  useEffect(() => {
    setFilteredShops(
      shops.filter(item => {
        const isOpen = isBusinessOpen(item.businessHours || []);
        return (!openOnly || isOpen) && (shopType === "ALL" || item.shopType === shopType);
      })
    );
  }, [shops, openOnly, shopType]);

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
    <div className="search-map-page">
      <div className="content-header">
        <div className="filter-container container">
          <div className="btn-wrapper">
            <SwitchButton
              labels={[{ label: "全て", value: "all" }, { label: "営業中", value: "open" }]}
              onChange={(value: string) => {
                setOpenOnly(value === "open");
              }}
            />
          </div>
          <div className="filter-wrapper">
            <Selector
              options={[
                { label: "全て", value: "ALL" },
                { label: "お弁当屋のみ", value: "BENTO" },
                { label: "フードトラックのみ", value: "FOOD_TRUCK" }
              ]}
              value={shopType}
              onChange={(event) => {
                setShopType(event.target.value as "ALL" | ShopType["type"]);
              }}
            />
          </div>
        </div>
      </div>
      <div className={`content ${isSp && isMapVisible ? "open" : "close"}`}>
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
            <button className={`zoom-btn zoom-in ${zoomLevel >= maxZoom ? 'over' : ''}`} onClick={zoomIn}>
              <AddIcon />
            </button>
            <button className={`zoom-btn zoom-out ${zoomLevel <= minZoom ? 'over' : ''}`} onClick={zoomOut}>
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
                // クリック時のデフォルトの情報ウィンドウを非表示にする
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
              options={googleMapOptions}
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
  );
}