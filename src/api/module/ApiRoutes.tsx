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
};

export default ApiRoutes;
