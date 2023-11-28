/*****************************
* environment.js
* path: '/environment.js' (root of your project)
******************************/

import Constants from "expo-constants";
import { Platform } from "react-native";

const url = "http://3.37.213.77:3000";
const url_loadbalance = "http://kbowLoadBalancer-1489709171.ap-northeast-2.elb.amazonaws.com";

const localhost =
 Platform.OS === "ios" ? "localhost:8080" : "10.0.2.2:8080";

const ENV = {
 dev: {
   apiUrl: url
 },
 staging: {
   apiUrl: url_loadbalance
   // Add other keys you want here
 },
 prod: {
   apiUrl:url_loadbalance
 }
};

const getEnvVars = (env = Constants.manifest.releaseChannel) => {
 // What is __DEV__ ?
 // This variable is set to true when react-native is running in Dev mode.
 // __DEV__ is true when run locally, but false when published.
 if (__DEV__) {
   return ENV.dev;
 } else if (env === 'staging') {
   return ENV.staging;
 } else if (env === 'prod') {
   return ENV.prod;
 }
};

export default getEnvVars;