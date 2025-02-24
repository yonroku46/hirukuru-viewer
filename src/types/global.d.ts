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
    dateFormat?: (value: string) => string;
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
  interface UserState extends User {
    point: number;
    token?: string;
    refreshToken?: string;
    shopOwner: boolean;
  }
  interface ItemState extends Item {
    categoryName?: string;
    quantity?: number;
  }
  interface OrderState extends Order {
    shopName: string;
    status: OrderStatusCount['status'];
    orderDetail: OrderDetail[];
  }
  // Status
  interface CartStatus {
    status: 'READY' | 'PICKUP' | 'PAYMENT' | 'FINAL' | 'DONE';
  }
  interface OrderStatus {
    status: 'PENDING' | 'BOOKED' | 'PICKUP' | 'DONE' | 'CANCEL';
  }
  interface OrderStatusCount {
    status: OrderStatus['status'];
    value: number;
  }
  interface ReviewStatusCount {
    status: 'COUNT' | 'AVG';
    value: number;
  }
  // Type
  interface DayType {
    type: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';
  }
  interface PayType {
    type: 'CASH' | 'CARD' | 'APPLE' | 'GOOGLE';
  }
  interface ShopType {
    type: 'BENTO' | 'FOOD_TRUCK';
  }
  interface ReceiverType {
    type: 'SHOP' | 'USER';
  }
  interface ServiceNoticeType {
    type: 'NOTICE' | 'EVENT';
  }
  interface ServiceInquiryType {
    type: 'SUGGEST' | 'BULK' | 'INQUIRY';
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
    inquiryDetail: string;
    createTime: string;
  }
  interface ServiceApply {
    applyId: string;
    shopType: ShopType['type'];
    shopSize: string;
    shopName: string;
    lastName: string;
    firstName: string;
    mail: string;
    phoneNum?: string;
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
    profileImg: string;
    thumbnailImg: string;
    shopName: string;
    shopIntro: string;
    location: string;
    detailAddress?: string;
    shopType: ShopType['type'];
    businessHours?: BusinessHour[];
    servingMinutes?: number;
    reviewCount?: number;
    ratingAvg?: number;
    rating?: {
      [key: string]: number | undefined;
    };
  }
  interface BusinessHour {
    dayOfWeek: DayType['type'];
    openTime: string;
    closeTime: string;
    businessDay: boolean;
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
    reviewRating: number;
    reviewContent: string;
    createTime: string;
  }
  interface Order extends Row {
    orderId: string;
    shopId: string;
    userId: string;
    payType: PayType['type'];
    totalPrice: number;
    pickupTime: string;
    createTime: string;
  }
  interface OrderDetail {
    orderId: string;
    itemId: string;
    itemName: string;
    itemPrice: number;
    options?: ItemOption[];
    quantity: number;
    itemTotalPrice: number;
  }
  interface Item {
    itemId: string;
    shopId: string;
    categoryId?: string;
    itemName: string;
    itemDescription?: string;
    itemOrder: number;
    allergens?: string;
    itemPrice: number;
    discountPrice?: number;
    ratingAvg?: number;
    thumbnailImg: string;
    stock?: number;
    optionMultiple?: boolean;
    options?: ItemOption[];
  }
  interface ItemOption {
    optionId: string;
    optionName: string;
    optionPrice: number;
    optionOrder: number;
  }
  interface ItemCategory {
    categoryId: string;
    shopId: string;
    categoryName: string;
    categoryOrder: number;
  }
  interface NotificationInfo {
    notificationId: string;
    receiverId: string;
    receiverType: ReceiverType['type'];
    title: string;
    message: string;
    readFlg: boolean;
    createTime: string;
  }
}

export {};