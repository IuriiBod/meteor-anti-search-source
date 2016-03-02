#!/usr/bin/env bash

#check if jshint exists
type jshint >/dev/null 2>&1  || {
  echo >&2 "jshint not installed! To install run:";
  echo >&2 "npm i -g jshint";
  exit 1;
}

jshint ./server ./client ./both
