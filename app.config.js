export default {
  expo: {
    name: "yoga-customer-app",
    slug: "yoga-customer-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      }
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router"
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      // Firebase configuration
      // Replace these with your actual Firebase project values
      firebaseApiKey: process.env.FIREBASE_API_KEY || "your-api-key",
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID || "your-project-id",
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "your-sender-id",
      firebaseAppId: process.env.FIREBASE_APP_ID || "your-app-id",
    },
  },
};
