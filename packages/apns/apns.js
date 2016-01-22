Apns = Npm.require('apns');

Apns.getAssetAbsolutePath = function (fileName) {
  var fs = Npm.require('fs');
  var path = Npm.require('path');

  var meteorRoot = fs.realpathSync(process.cwd() + '/../');

  var assetsFolder = meteorRoot + '/server/assets/app';

  if (fileName) {
    assetsFolder += '/' + fileName;
  }

  return assetsFolder;
};