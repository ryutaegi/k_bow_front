import 'dotenv/config';

export default {
  expo: {
    name: "활로",
    slug: "react-exam",
    version: "1.0.25",
    orientation: "portrait",
    icon: "./assets/logo4_square.png",
    userInterfaceStyle: "light",
    backgroundColor: "#ffffff",
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
      bundleIdentifier: "com.taeyou.hwalro",
      buildNumber: "5",
      usesAppleSignIn: true,
      entitlements: {
        "keychain-access-groups": ["$(AppIdentifierPrefix)com.taeyou.hwalro"]
      },
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/logo4_square.png",
        backgroundColor: "#059bf4"
      },
      package: "com.taeyou.hwalro",
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
        projectId: "2f55eaf0-1035-443b-bb5f-52cebfb4482d"
      }
    },
    runtimeVersion: {
      policy: "appVersion"
    },
    updates: {
      url: "https://u.expo.dev/2f55eaf0-1035-443b-bb5f-52cebfb4482d"
    }
  }
};
