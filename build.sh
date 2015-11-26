#!/usr/bin/env bash
rm -R ../hospohero-build
meteor build ../hospohero-build --server=https://hospoherotesting.herokuapp.com
keytool -genkey -alias hospohero -keyalg RSA -keysize 2048 -validity 10000
cd ../hospohero-build/android/
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 unaligned.apk hospohero
~/.meteor/android_bundle/android-sdk/build-tools/21.0.0/zipalign 4 unaligned.apk hospohero.apk