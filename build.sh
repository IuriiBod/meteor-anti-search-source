#!/usr/bin/env bash

#
# Builds app
#

#
# To generate new key
# $ keytool -genkey -alias "HospoHero" -keyalg RSA -keysize 2048 -validity 10000
#

APP_NAME="HospoHero"
SERVER_URL="https://hospoherotesting.herokuapp.com"
BUILD_FOLDER="../hospohero-build"
APK_OUTPUT_FOLDER=~/Dropbox/HH/mobile_apps/android
UNSIGNED_APK_NAME="release-unsigned.apk"
SIGNED_APK_NAME="${APP_NAME}.apk"

ANDROID_HOME=~/Library/Android/sdk
ANDROID_BUILD_TOOLS_VERSION="23.0.2"

echo "Before building:"
echo "1) remove 'crosswalk' package"
echo "2) ensure 'force-ssl' package is enabled"
echo
echo "Press ANY key to continue"
read -rsn1

#build project for production
meteor build ${BUILD_FOLDER} --server=${SERVER_URL}

#sign APK
cd "${BUILD_FOLDER}/android"

if [ ! -f ${SIGNED_APK_NAME} ]; then
  rm ${SIGNED_APK_NAME}
fi

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 ${UNSIGNED_APK_NAME} ${APP_NAME}
${ANDROID_HOME}/build-tools/${ANDROID_BUILD_TOOLS_VERSION}/zipalign 4 ${UNSIGNED_APK_NAME} ${SIGNED_APK_NAME}

#save to shared folder on Dropbox
rm -rf ${APK_OUTPUT_FOLDER}/*
cp ${SIGNED_APK_NAME} ${APK_OUTPUT_FOLDER}

echo "APKs saved to ${APK_OUTPUT_FOLDER}"
echo "DONE"
