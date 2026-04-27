import 'dotenv/config';

export default {
  expo: {
    name: "활로",
    slug: "react-exam",
    version: "1.0.24",
    orientation: "portrait",
    icon: "./assets/logo4_square.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash_logo4.png",
      resizeMode: "contain",
      backgroundColor: "#059bf4"
    },
    plugins: [
      "expo-apple-authentication",
      [
        "@react-native-google-signin/google-signin",
        {
          iosUrlScheme: "com.googleusercontent.apps.848442562466-7qbh3d1clv3dpgr32dbg0vc2md9hgu8v"
        }
      ]
    ],
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.taeyou.reactexam",
      usesAppleSignIn: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/logo4_square.png",
        backgroundColor: "#059bf4"
      },
      package: "com.taeyou.reactexam",
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY
        }
      },
      versionCode: 2
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      eas: {
        projectId: "91df4db1-caa7-42fd-b47a-5fc4c9979550"
      }
    },
    runtimeVersion: {
      policy: "appVersion"
    },
    updates: {
      url: "https://u.expo.dev/91df4db1-caa7-42fd-b47a-5fc4c9979550"
    }
  }
};
