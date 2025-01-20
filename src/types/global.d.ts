declare global {
  // Base
  interface ApiResponse {
    resultCode: number;
    hasErrors: boolean;
    informations: Array<any>;
    errors: Array<any>;
    responseData: any;
  }
  interface ActionRes {
    success: boolean;
    id?: string;
  }
  interface ListRes<T> {
    list: Array<T>
  }
  interface CountRes {
    count: number
  }
  // Table
  interface Column<T> {
    key: keyof T;
    label: string;
    type: 'text' | 'textarea' | 'number' | 'list' | 'select' | 'switch' | 'time' | 'date' | 'image' | 'status' | 'rating' | 'options';
    typeUnit?: string;
    width?: number;
    minWidth?: number;
    maxWidth?: number;
    align?: 'right' | 'center';
    hide?: boolean;
    format?: (value: number) => string;
    listColumns?: Column<T>[];
  }
  interface Row {
    id: string;
    imgFile?: File;
    [key: string]: string | number | any[] | undefined;
  }
  // Menu
  interface MenuItem {
    name: string;
    href: string;
    icon?: React.ReactNode;
  }
  interface GroupMenuItem {
    groupName: string;
    groupHref: string;
    groupItems: MenuItem[];
  }
  interface Tab {
    label: string;
    active: boolean;
    panel: React.ReactNode
  }
  interface Breadcrumb {
    label: string;
    href: string;
    active?: boolean;
  }
  interface LinkItem {
    title: string;
    href: string;
    icon?: React.ReactNode;
    disabled?: boolean;
  }
  interface OrderStatus {
    type: 'booked' | 'pickup' | 'done' | 'review' | 'cancel';
    value: number;
  }
  interface ReviewStatus {
    type: 'count' | 'avg';
    value: number;
  }
  interface SearchFilter {
    type: 'text' | 'number' | 'radio' | 'date' | 'year' | 'month' | 'select';
    key: string;
    label: string;
    value: string;
    options?: { label: string; repeat?: number; value: string }[];
  }
  interface User {
    userId: string;
    name: string;
    profileImage: string;
    point: number;
    shopOwner: boolean;
  }
  interface ServiceEvent {
    eventId: string;
    title: string;
    description: string;
    image: string;
    href?: string;
  }
  interface Place {
    placeId: string;
    shopId?: string;
    position: PlacePosition;
  }
  interface PlacePosition {
    lat: number;
    lng: number;
  }
  interface Shop {
    shopId: string;
    location: string;
    detailAddress?: string;
    name: string;
    description: string;
    image: string;
    businessHours: BusinessHour[];
    reviewcount?: number;
    ratingAvg?: number;
    rating?: {
      [key: string]: number | undefined;
    };
  }
  interface BusinessHour {
    day: 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
    open: string;
    close: string;
  }
  interface ShopReview extends Row {
    reviewId: string;
    userId: string;
    userName: string;
    userProfile: string;
    userRatingCount?: number;
    userRatingAvg?: number;
    shopId: string;
    shopName: string;
    rating: number;
    comment: string;
    date: string;
  }
  interface Order extends Row {
    orderId: string;
    userId: string;
    shopId: string;
    status: string;
    shopName: string;
    totalPrice: number;
    pickupTime: string;
    orderTime: string;
    orderDetail: OrderDetail[];
  }
  interface OrderDetail {
    orderId: string;
    foodId: string;
    name: string;
    options?: FoodOption[];
    price: number;
    quantity: number;
    totalPrice: number;
  }
  interface Food {
    foodId: string;
    shopId: string;
    category: string;
    name: string;
    description?: string;
    ingredients?: string[];
    price: number;
    discountPrice?: number;
    rating?: number;
    image: string;
    quantity?: number;
    stock?: number;
    optionMultiple?: boolean;
    options?: FoodOption[];
  }
  interface FoodOption {
    optionId: string;
    foodId: string;
    shopId: string;
    name: string;
    price: number;
  }
}

export {};