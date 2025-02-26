const ROOT = process.env.NEXT_PUBLIC_API_ROOT;

// public
const HEALTH_CHECK = `${ROOT}/health-check`;

// oauth2
const OAUTH2_ROOT = `${ROOT}/oauth2`;
const GOOGLE_ACCESS_TOKEN = `${OAUTH2_ROOT}/google/access-token`;
const LINE_ACCESS_TOKEN = `${OAUTH2_ROOT}/line/access-token`;

// auth
const AUTH_ROOT = `${ROOT}/auth`;
const LOGIN = `${AUTH_ROOT}/login`;
const LOGOUT = `${AUTH_ROOT}/logout`;
const SUBMIT = `${AUTH_ROOT}/submit`;
const RECOVER = `${AUTH_ROOT}/recover`;
const VERIFY_TOKEN = `${AUTH_ROOT}/verify`;
const REFRESH_TOKEN = `${AUTH_ROOT}/refresh-token`;

// user
const USER_ROOT = `${ROOT}/user`;
const USER_INFO = `${USER_ROOT}/info`;
const USER_ADMISSION = `${USER_ROOT}/admission`;
const USER_ADMISSION_LOG = `${USER_ROOT}/admission/log`;
const USER_FAVORITE = `${USER_ROOT}/favorite`;
const USER_SIGNOUT = `${USER_ROOT}/signout`;
const USER_ORDER_STATUS = `${USER_ROOT}/order/status`;
const USER_ORDER_LIST = `${USER_ROOT}/order/list`;
const USER_REVIEW_STATUS = `${USER_ROOT}/review/status`;
const USER_REVIEW_LIST = `${USER_ROOT}/review/list`;

// order
const ORDER_ROOT = `${ROOT}/order`;
const ORDER_INFO = `${ORDER_ROOT}`;
const ORDER_INFO_USER = `${ORDER_ROOT}/user`;
const ORDER_INFO_SHOP = `${ORDER_ROOT}/shop`;

// platform(service)
const PLATFORM_ROOT = `${ROOT}/service`;
const CONTACT_SUBMIT = `${PLATFORM_ROOT}/contact/submit`;
const PARTNER_SUBMIT = `${PLATFORM_ROOT}/partner/submit`;

// partner
const PARTNER_ROOT = `${ROOT}/partner`;
const PARTNER_ORDER_LIST = `${PARTNER_ROOT}/order/list`;

const ApiRoutes = {
  HEALTH_CHECK,
  GOOGLE_ACCESS_TOKEN,
  LINE_ACCESS_TOKEN,
  LOGIN,
  LOGOUT,
  SUBMIT,
  RECOVER,
  VERIFY_TOKEN,
  REFRESH_TOKEN,
  USER_INFO,
  USER_ADMISSION,
  USER_ADMISSION_LOG,
  USER_FAVORITE,
  USER_SIGNOUT,
  USER_ORDER_STATUS,
  USER_ORDER_LIST,
  USER_REVIEW_STATUS,
  USER_REVIEW_LIST,
  ORDER_INFO,
  ORDER_INFO_USER,
  ORDER_INFO_SHOP,
  CONTACT_SUBMIT,
  PARTNER_SUBMIT,
  PARTNER_ORDER_LIST
};


export default ApiRoutes;
