import Constants from "expo-constants";

const url_ec = "https://kbow-server-production.up.railway.app";
const url_ec_test = "https://kbow-server-production.up.railway.app";

const ENV = {
  dev: {
    apiUrl: url_ec_test,
    GOOGLE_WEB_CLIENT_ID: '848442562466-69be2euhg23jm3onqkup2486fijj2ugj.apps.googleusercontent.com',
    GOOGLE_IOS_CLIENT_ID: '848442562466-7qbh3d1clv3dpgr32dbg0vc2md9hgu8v.apps.googleusercontent.com',
  },
  prod: {
    apiUrl: url_ec,
    GOOGLE_WEB_CLIENT_ID: '848442562466-69be2euhg23jm3onqkup2486fijj2ugj.apps.googleusercontent.com',
    GOOGLE_IOS_CLIENT_ID: '848442562466-7qbh3d1clv3dpgr32dbg0vc2md9hgu8v.apps.googleusercontent.com',
  },
};

const getEnvVars = __DEV__ ? ENV.dev : ENV.prod;

export default getEnvVars;
