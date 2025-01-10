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
    type: 'text' | 'textarea' | 'number' | 'list' | 'select' | 'switch' | 'time' | 'date' | 'image' | 'status' | 'rating';
    minWidth?: number;
    align?: 'right' | 'center';
    hide?: boolean;
    format?: (value: number) => string;
  }
  interface Row {
    id: string;
    imgFile?: File;
    [key: string]: string | number | undefined;
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
    type: 'text' | 'date' | 'year' | 'month';
    key: string;
    label: string;
    value: string;
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
  interface ShopInfo {
    shopId: string;
    name: string;
    description: string;
    image: string;
    reviewcount?: number;
    ratingAvg?: number;
    rating: {
      [key: string]: number | undefined;
    };
  }
  interface ShopReview extends Row {
    reviewId: string;
    userId: string;
    userName: string;
    userProfile: string;
    userRatingCount?: number;
    userRatingAvg?: number;
    shopId: string;
    rating: number;
    comment: string;
    date: string;
  }
  interface Order extends Row {
    orderId: string;
    userId: string;
    shopId: string;
    status: string;
    date: string;
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
  }
}

export {};