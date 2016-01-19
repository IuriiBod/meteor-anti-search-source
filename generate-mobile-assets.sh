#!/usr/bin/env bash

#
# Install splashicon-generator and imagemagic in order to use it:
#
# > brew install imagemagick
# > npm install splashicon-generator -g
#

cd public/mobile
rm -R res
rm -R store
splashicon-generator --imagespath="production-icon-and-splash"
exit