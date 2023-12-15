/*****************************
* environment.js
* path: '/environment.js' (root of your project)
******************************/

import Constants from "expo-constants";
import { Platform } from "react-native";

const url = "http://3.37.213.77:3000";
const url_loadbalance = "http://kbowLoadBalancer-1489709171.ap-northeast-2.elb.amazonaws.com";
const url_ec = "http://117.17.198.45:5032"
const url_ec_test = "http://117.17.198.45:5033"

const localhost =
 Platform.OS === "ios" ? "localhost:8080" : "10.0.2.2:8080";

const ENV = {
 dev: {
   apiUrl: url_ec_test
 },
 staging: {
   apiUrl: url_ec
   // Add other keys you want here
 },
 prod: {
   apiUrl:url_ec
 }
};

// const getEnvVars = (env = Constants.manifest2.releaseChannel) => {
//  // What is __DEV__ ?
//  // This variable is set to true when react-native is running in Dev mode.
//  // __DEV__ is true when run locally, but false when published.
//  if (__DEV__) {
//    return ENV.dev;
//  } else if (env === 'staging') {
//    return ENV.staging;
//  } else {
//    return ENV.prod;
//  }
// };

const getEnvVars = ENV.prod;

export default getEnvVars;