#!/usr/bin/env bash
cd public/mobile
rm -R res
rm -R store
splashicon-generator --imagespath="production-icon-and-splash"
exit