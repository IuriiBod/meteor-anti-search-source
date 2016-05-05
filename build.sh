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

beep() {
  echo -ne '\007'
}

# Initialize mobile server
setStagingServerUrl() {
    SERVER_URL="https://hospohero.herokuapp.com"
    MOBILE_SETTINGS=".mupx-deploy/settings-test.json"
}

setTestingServerUrl () {
    SERVER_URL="https://hospoherotesting.herokuapp.com"
    MOBILE_SETTINGS=".mupx-deploy/settings-test.json"
}

setProductionServerUrl() {
    SERVER_URL="https://app.hospohero.com"
    MOBILE_SETTINGS=".mupx-deploy/settings.json"
}

case "$1" in
  "production")
    setProductionServerUrl
    ;;
  "testing")
    setTestingServerUrl
    ;;
  "staging")
    setStagingServerUrl
    ;;
  *)
    setTestingServerUrl
    ;;
esac


APP_NAME="HospoHero"

BUILD_FOLDER="../hospohero-build"

APK_OUTPUT_FOLDER=~/Dropbox/HH/mobile_apps/android
UNSIGNED_APK_NAME="release-unsigned.apk"
ALTERNATIVE_APK_PATH="./project/build/outputs/apk/android-armv7-release-unsigned.apk"

ANDROID_HOME=~/Library/Android/sdk
ANDROID_BUILD_TOOLS_VERSION="23.0.2"

#GET SOME PRE BUILD INFO
MOBILE_APP_VERSION=$(sed '5q;d' mobile-config.js)
MOBILE_APP_VERSION=${MOBILE_APP_VERSION#*\'}
MOBILE_APP_VERSION=${MOBILE_APP_VERSION%\'*}
SIGNED_APK_NAME="${APP_NAME}_${MOBILE_APP_VERSION}.apk"

if grep -Fxq "force-ssl" ./.meteor/packages; then
  IS_FORCE_SSL_ENABLED='YES'
else
  IS_FORCE_SSL_ENABLED='NO'
fi

echo "==== Building summary ===="
echo "* mobile server: ${SERVER_URL}"
echo "* mobile app version: ${MOBILE_APP_VERSION}"
echo "* force-ssl is enabled: ${IS_FORCE_SSL_ENABLED}"
echo "=========================="
echo "TIP: odd '1' - production, even '2' - testing"
echo
echo "Press ANY key to continue"
read -rsn1

# disable removing for now (it may retain xcode project params and speed up build)
#echo "Remove old build in ${BUILD_FOLDER} and ./.meteor/local folders"
#rm -rf ${BUILD_FOLDER} ./.meteor/local/.build* ./.meteor/local/build ./.meteor/local/cordova-build ./.meteor/local/bundler-cache

# android build folder retains old app version after new build
rm -rf "${BUILD_FOLDER}/android"

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

beep # sound signal about required password
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 ${UNSIGNED_APK_NAME} ${APP_NAME} > /dev/null
${ANDROID_HOME}/build-tools/${ANDROID_BUILD_TOOLS_VERSION}/zipalign 4 ${UNSIGNED_APK_NAME} ${SIGNED_APK_NAME} > /dev/null

# save to shared folder on Dropbox
rm -f ${APK_OUTPUT_FOLDER}/${SIGNED_APK_NAME}
cp ${SIGNED_APK_NAME} ${APK_OUTPUT_FOLDER}

echo "APKs saved to ${APK_OUTPUT_FOLDER}"

echo "Install APK on device (CTRL+C=Cancel)?"
beep # signal that confirmations required
read -rsn1

echo "Remove old APK:"
adb uninstall com.tomhay.hospohero

echo "Install new version:"
adb install "${APK_OUTPUT_FOLDER}/${SIGNED_APK_NAME}"

echo "DONE"