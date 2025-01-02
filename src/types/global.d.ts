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
  interface ServiceEvent {
    id: string;
    title: string;
    description: string;
    image: string;
    href?: string;
  }
  interface ShopInfo {
    id: string;
    name: string;
    description: string;
    image: string;
    reviewcount?: number;
    ratingAvg?: number;
    rating: {
      [key: string]: number | undefined;
    };
  }
  interface ShopReview {
    id: string;
    userId: string;
    user: string;
    userProfile: string;
    userRatingCount?: number;
    userRatingAvg?: number;
    shopId: string;
    rating: number;
    comment: string;
    date: string;
  }
  interface Food {
    id: string;
    shopId: string;
    category: string;
    name: string;
    price: number;
    discountPrice?: number;
    rating?: number;
    image: string;
    quantity?: number;
  }
}

export {};