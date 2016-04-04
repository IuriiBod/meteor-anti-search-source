#!/usr/bin/env bash

#
# Install splashicon-generator and imagemagic in order to use it:
#
# > brew install imagemagick
# > npm install splashicon-generator -g
#

cd public/mobile

#remove old icons
rm -rf res
rm -rf store

splashicon-generator --imagespath="production-icon-and-splash"

#remove redundant assets
rm -rf res/icons/windows
rm -rf res/icons/wp8
rm -rf res/screens/windows
rm -rf res/screens/wp8
exit