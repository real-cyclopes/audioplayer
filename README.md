# AudioPlayer app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npm start
   ```

   Use below command if you want to run the Web version locally

   ```bash
    npm run web
   ```

## Build for Web
   ```bash
   npm run web:prod
   ```

## Build for Android and iOS

###  Using EAS

Reference https://docs.expo.dev/build/setup/

#### Prerequisites

##### Install the latest EAS CLI & Log in to your Expo account

- npm install -g eas-cli
- eas login
##### Configure the project

- eas build: configure

#### Build for app stores

eas build --platform android
eas build --platform ios

eas build --platform all

#### Build for Android Emulator/device or iOS Simulator

Reference

https://docs.expo.dev/build-reference/apk/
https://docs.expo.dev/build-reference/simulators/

### Production builds locally

Reference

https://docs.expo.dev/workflow/prebuild/
https://reactnative.dev/docs/signed-apk-android
https://reactnative.dev/docs/publishing-to-app-store