const appUri = `${process.env.NEXT_PUBLIC_APP_ADDRESS}${process.env.NEXT_PUBLIC_VIEW_PORT ? ':' + process.env.NEXT_PUBLIC_VIEW_PORT : ''}${process.env.NEXT_PUBLIC_OAUTH2_ROOT}`;

// Google Login
export function googleLogin() {
  const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
  const clientId = `${process.env.NEXT_PUBLIC_GOOGLE_ID}`;
  const redirectUri = `${appUri}/google`;
  const url = `${authUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.profile%20email`;
  return url;
}