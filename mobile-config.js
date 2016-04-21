App.info({
  id: 'com.tomhay.hospohero',
  name: 'Hospo Hero',
  description: 'Taking a lot of the kitchen manual tasks and making them quick, easy and accurate',
  version: '0.1.2',
  author: 'Tom Hay',
  email: 'info@hospohero.com',
  website: 'https://app.hospohero.com'
});

App.icons({
  // iOS
  'iphone': 'public/mobile/res/icons/ios/icon-60.png',
  'iphone_2x': 'public/mobile/res/icons/ios/icon-60-2x.png',
  'iphone_3x': 'public/mobile/res/icons/ios/icon-60-3x.png',
  'ipad': 'public/mobile/res/icons/ios/icon-76.png',
  'ipad_2x': 'public/mobile/res/icons/ios/icon-76-2x.png',

  // Android
  'android_ldpi': 'public/mobile/res/icons/android/icon-36-ldpi.png',
  'android_mdpi': 'public/mobile/res/icons/android/icon-48-mdpi.png',
  'android_hdpi': 'public/mobile/res/icons/android/icon-72-hdpi.png',
  'android_xhdpi': 'public/mobile/res/icons/android/icon-96-xhdpi.png'
});

App.launchScreens({
  // iOS
  'iphone': 'public/mobile/res/screens/ios/screen-iphone-portrait.png',
  'iphone_2x': 'public/mobile/res/screens/ios/screen-iphone-portrait-2x.png',
  'iphone5': 'public/mobile/res/screens/ios/screen-iphone-568h-2x.png',
  'iphone6': 'public/mobile/res/screens/ios/screen-iphone-portrait-667h.png',
  'iphone6p_portrait': 'public/mobile/res/screens/ios/screen-iphone-portrait-736h.png',
  'iphone6p_landscape': 'public/mobile/res/screens/ios/screen-iphone-landscape-736h.png',

  'ipad_portrait': 'public/mobile/res/screens/ios/screen-ipad-portrait.png',
  'ipad_portrait_2x': 'public/mobile/res/screens/ios/screen-ipad-portrait-2x.png',
  'ipad_landscape': 'public/mobile/res/screens/ios/screen-ipad-landscape.png',
  'ipad_landscape_2x': 'public/mobile/res/screens/ios/screen-ipad-landscape-2x.png',

  // Android
  'android_ldpi_portrait': 'public/mobile/res/screens/android/screen-ldpi-portrait.png',
  'android_ldpi_landscape': 'public/mobile/res/screens/android/screen-ldpi-landscape.png',
  'android_mdpi_portrait': 'public/mobile/res/screens/android/screen-mdpi-portrait.png',
  'android_mdpi_landscape': 'public/mobile/res/screens/android/screen-mdpi-landscape.png',
  'android_hdpi_portrait': 'public/mobile/res/screens/android/screen-hdpi-portrait.png',
  'android_hdpi_landscape': 'public/mobile/res/screens/android/screen-hdpi-landscape.png',
  'android_xhdpi_portrait': 'public/mobile/res/screens/android/screen-xhdpi-portrait.png',
  'android_xhdpi_landscape': 'public/mobile/res/screens/android/screen-xhdpi-landscape.png'
});

App.setPreference('SplashScreenDelay', 10000);
App.setPreference('StatusBarOverlaysWebView', 'false');

App.accessRule('*');