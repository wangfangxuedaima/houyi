import systemConfig from "../config";
import Cookies from "js-cookie";
const ssoUrl = "https://sso.sohu-inc.com/login";

export function getSSoToken(cookieKey) {
  const value = Cookies.get(cookieKey);
  return value ? decodeURIComponent(value) : "";
}

export function redirectToSso() {
  location.href = `${ssoUrl}?appid=${systemConfig.ssoAppId}&ssoP=${systemConfig.ssoP}`;
}
