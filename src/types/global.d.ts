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
    type: 'text' | 'textarea' | 'number' | 'list' | 'select' | 'switch' | 'time' | 'date' | 'image' | 'status' | 'rating' | 'options' | 'payType';
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
  interface SearchFilter {
    type: 'text' | 'number' | 'radio' | 'date' | 'year' | 'month' | 'select';
    key: string;
    label: string;
    value: string;
    options?: { label: string; repeat?: number; value: string }[];
  }
  // Status
  interface CartStatus {
    type: 'ready' | 'pickup' | 'payment' | 'final' | 'done';
  }
  interface OrderStatus {
    type: 'booked' | 'pickup' | 'done' | 'review' | 'cancel';
    value: number;
  }
  interface ReviewStatus {
    type: 'count' | 'avg';
    value: number;
  }
  interface UserState extends User {
    point: number;
    token?: string;
    refreshToken?: string;
    shopOwner: boolean;
  }
  // Type
  interface PayType {
    type: 'cash' | 'card' | 'apple' | 'google';
  }
  interface ShopType {
    type: 'bento' | 'foodtruck';
  }
  interface ServiceNoticeType {
    type: 'notice' | 'event';
  }
  interface ServiceInquiryType {
    type: 'suggest' | 'bulk' | 'inquiry';
  }
  // DB
  interface User {
    userId: string;
    userName: string;
    profileImg: string;
    mail: string;
    userIntro?: string;
    phoneNum?: string;
    birthday?: string;
    gender?: string;
    postalCode?: string;
    detailAddress?: string;
  }
  interface UserSpot {
    spotId: string;
    userId: string;
    spotName: string;
    latitude: number;
    longitude: number;
    accuracy: number;
  }
  interface ServiceNotice {
    noticeId: string;
    thumbnailImg: string;
    noticeType: ServiceNoticeType['type'];
    noticeTitle: string;
    noticeDetail: string;
    noticeHref?: string;
    createTime: string;
  }
  interface ServiceInquiry {
    inquiryId: string;
    inquiryType: ServiceInquiryType['type'];
    mail: string;
    phoneNum?: string;
    inquiryTitle: string;
    inquiryDetail: string;
    createTime: string;
  }
  interface ServiceApply {
    applyId: string;
    shopType: ShopType['type'];
    mail: string;
    phoneNum?: string;
    shopName: string;
    shopSize: string;
    requestDetail?: string;
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
    shopName: string;
    description: string;
    type: ShopType['type'];
    thumbnailImg: string;
    businessHours?: BusinessHour[];
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
    payType: PayType['type'];
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
    thumbnailImg: string;
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