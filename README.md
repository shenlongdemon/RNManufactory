# Description

The mobile application repository

# Configuration

## Integration CocoaPod

NOTES: When we install package and `react-native link <package>` then we must check Pod file. 
If there is pod link inside pod file the we must `pod install` in `./ios` folder

Because new RN, iOS uses Cocoapod to manage libraries so some libraries cannot work via `npm install` and `react-native link`.
So We need to create pod project and manage them after `npm install`

- Init pod file in project, see <https://facebook.github.io/react-native/docs/integration-with-existing-apps>
- `npm install` package which we want and `react-native link`. It will be add pod inside pod file
- In XCode, add project from `./node_modules/<package>/ios/<package>.xcodeporj` by right click on Libraries in XCode and `Add Files to <project>`
- Go to project -> target -> General -> `Linked Frameworks and Libraries` -> Add `lib<package>.a`
- Run `npm install`  -> `react-native link` -> go to `/ios` folder and run `pod install` 

## Install business-core-app package

* Setup SSH

    Please install SSH and we can install npm from Gitlab

* Install

    ```bash

    ```

## Install with yarn

* For typescript

  ```bash
  yarn add -D @types/xxx
  ```

## Environment variable

### Permission

* iOS
  
  ```bash
  <key>ITSAppUsesNonExemptEncryption</key>
  <false/>
  <key>NSAppTransportSecurity</key>
  <dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
    <key>NSExceptionDomains</key>
    <dict>
      <key>localhost</key>
      <dict>
        <key>NSExceptionAllowsInsecureHTTPLoads</key>
        <true/>
      </dict>
      <key>192.168.79.84</key>
      <dict>
        <key>NSExceptionAllowsInsecureHTTPLoads</key>
        <true/>
        <key>NSIncludesSubdomains</key>
        <true/>
      </dict>
      <key>api.openweathermap.org</key>
      <dict>
        <key>NSExceptionAllowsInsecureHTTPLoads</key>
        <true/>
        <key>NSIncludesSubdomains</key>
        <true/>
      </dict>
      <key>shenlongdemon.github.io</key>
      <dict>
        <key>NSExceptionAllowsInsecureHTTPLoads</key>
        <true/>
        <key>NSIncludesSubdomains</key>
        <true/>
      </dict>
    </dict>
  </dict>
  ```
  
* Android
 
  ```bash
   <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
   
   <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
   <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
   <uses-permission-sdk-23 android:name="android.permission.ACCESS_COARSE_LOCATION"/>
  
   <uses-permission android:name="android.permission.VIBRATE"/>
   <uses-permission android:name="android.permission.BLUETOOTH"/>
   <uses-permission android:name="android.permission.BLUETOOTH_ADMIN"/>
   <uses-feature android:name="android.hardware.bluetooth_le" android:required="true"/>
  ```

### Using QRCode Scanner, see <https://github.com/moaazsidat/react-native-qrcode-scanner>

  ```bash
  npm install react-native-qrcode-scanner --save

  
  react-native link react-native-qrcode-scanner
  react-native link react-native-permissions
  ```
  
* For Android
  
  Add permission
  
  ```bash
  <uses-permission android:name="android.permission.VIBRATE"/>
  ```
  
* For iOS
  
  Add permission
  
  ```bash
  <key>NSBluetoothPeripheralUsageDescription</key>
  <string>Allow $(PRODUCT_NAME) to access your bluetooth</string>
  <key>NSCalendarsUsageDescription</key>
  <string>Allow $(PRODUCT_NAME) to access your calendar</string>
  <key>NSCameraUsageDescription</key>
  <string>Allow $(PRODUCT_NAME) to use your camera</string>
  <key>NSContactsUsageDescription</key>
  <string>Allow $(PRODUCT_NAME) to access your contacts</string>
  <key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
  <string>Allow $(PRODUCT_NAME) to access your location</string>
  <key>NSLocationWhenInUseUsageDescription</key>
  <string>Allow $(PRODUCT_NAME) to access your location</string>
  <key>NSMicrophoneUsageDescription</key>
  <string>Allow $(PRODUCT_NAME) to access your microphone</string>
  <key>NSMotionUsageDescription</key>
  <string>Allow $(PRODUCT_NAME) to access your device's accelerometer</string>
  <key>NSPhotoLibraryAddUsageDescription</key>
  <string>Give $(PRODUCT_NAME) permission to save photos</string>
  <key>NSPhotoLibraryUsageDescription</key>
  <string>Give $(PRODUCT_NAME) permission to access your photos</string>
  <key>NSRemindersUsageDescription</key>
  <string>Allow $(PRODUCT_NAME) to access your reminders</string>
  ```
### Using `react-nvigation`, see <https://reactnavigation.org/docs/en/getting-started.html>.

  After `react-native link react-navigation`, we must to `react-native link react-native-gesture-handler`.
  If not, we have face to problem `Cannot read property 'State' of undefined`


### Using `react-native-config`, see <https://github.com/luggit/react-native-config>.
* Link RN lib before running

  ```bash
  react-native link
  ```

* Android - You'll also need to manually apply a plugin to your app, from `android/app/build.gradle`:

  ```bash
  // 2nd line, add a new apply:
  apply from: project(':react-native-config').projectDir.getPath() + "/dotenv.gradle"
  ```

* iOS - Need to add React Native Config project from `node_modules/react-native-config/ios` to `Libraries` in Xcode.
Set `Info.plist Preprocessor Prefix File` with `$(SRCROOT)/../node_modules/react-native-config/ios/ReactNativeConfig/GeneratedInfoPlistDotEnv.h`.
And set some command at end of `Podfile`

  ```bash
  post_install do |installer|
      installer.pods_project.targets.each do |target|
          if target.name == 'react-native-config'
              phase = target.project.new(Xcodeproj::Project::Object::PBXShellScriptBuildPhase)
              phase.shell_script = "cd ../../"\
              " && RNC_ROOT=./node_modules/react-native-config"\
              " && export SYMROOT=$RNC_ROOT/ios/ReactNativeConfig"\
              " && export BUILD_DIR=$RNC_ROOT/ios/ReactNativeConfig"\
              " && ruby $RNC_ROOT/ios/ReactNativeConfig/BuildDotenvConfig.ruby"
  
              target.build_phases << phase
              target.build_phases.move(phase,0)
          end
      end
  end
  ```


* Create environment files such as .env (default), .env.staging, .env.production

* Run with command with using .env by default
  
  ```bash
  react-native run-android
  ```

  or

  ```bash
  ENVFILE=.env react-native run-android
  ```

# Issues

## Env

* bundling failed: Error: Unable to resolve module /../react-transform-hmr/lib/index.js

  ```bash
  npm cache clean --force && react-native start --reset-cache
  ```