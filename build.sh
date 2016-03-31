#!/usr/bin/env bash

#
# Builds app
#

#
# To generate new key
# $ keytool -genkey -alias "HospoHero" -keyalg RSA -keysize 2048 -validity 10000
#
# Note: keystore backup is required. APK uploaded to
# Google Play should be always signed with the same key, stored in `~/.keysore`.
#

APP_NAME="HospoHero"
SERVER_URL="https://hospoherotesting.herokuapp.com"
MOBILE_SETTINGS=".mupx-deploy/settings.json"

BUILD_FOLDER="../hospohero-build"

APK_OUTPUT_FOLDER=~/Dropbox/HH/mobile_apps/android
UNSIGNED_APK_NAME="release-unsigned.apk"
ALTERNATIVE_APK_PATH="./project/build/outputs/apk/android-armv7-release-unsigned.apk"
SIGNED_APK_NAME="${APP_NAME}.apk"

ANDROID_HOME=~/Library/Android/sdk
ANDROID_BUILD_TOOLS_VERSION="23.0.2"

echo "Before building:"
echo "1) remove 'crosswalk' package"
echo "2) ensure 'force-ssl' package is enabled"
echo
echo "Press ANY key to continue"
read -rsn1

echo "Remove old build in ${BUILD_FOLDER} and ./.meteor/local folders"
rm -rf ${BUILD_FOLDER} ./.meteor/local/.build* ./.meteor/local/build ./.meteor/local/cordova-build ./.meteor/local/bundler-cache

# build project for production
meteor build ${BUILD_FOLDER} --server=${SERVER_URL} --mobile-settings=${MOBILE_SETTINGS}


# ==== iOS

#open generated project inside Xcode
open -a Xcode "${BUILD_FOLDER}/ios/project/Hospo Hero.xcodeproj"


# ==== Android

# sign APK
cd "${BUILD_FOLDER}/android"

# provide APK file if it is missed
if [ ! -f ${UNSIGNED_APK_NAME} ]; then
  cp ${ALTERNATIVE_APK_PATH} ./${UNSIGNED_APK_NAME}
  echo "Missing unsigned APK, so it was taken from ${ALTERNATIVE_APK_PATH}"
fi

# remove old signed APK
if [ -f ${SIGNED_APK_NAME} ]; then
  rm -f ${SIGNED_APK_NAME}
fi

echo -ne '\007' # sound signal about required password
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 ${UNSIGNED_APK_NAME} ${APP_NAME} > /dev/null
${ANDROID_HOME}/build-tools/${ANDROID_BUILD_TOOLS_VERSION}/zipalign 4 ${UNSIGNED_APK_NAME} ${SIGNED_APK_NAME} > /dev/null

# save to shared folder on Dropbox
rm -f ${APK_OUTPUT_FOLDER}/${SIGNED_APK_NAME}
cp ${SIGNED_APK_NAME} ${APK_OUTPUT_FOLDER}

echo "APKs saved to ${APK_OUTPUT_FOLDER}"

echo "Install APK on device (CTRL+C=Cancel)?"
echo -ne '\007' # signal that confirmations required
read -rsn1

echo "Remove old APK:"
adb uninstall com.tomhay.hospohero

echo "Install new version:"
adb install "${APK_OUTPUT_FOLDER}/${SIGNED_APK_NAME}"

echo "DONE"