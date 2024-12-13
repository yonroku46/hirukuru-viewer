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
}

export {};