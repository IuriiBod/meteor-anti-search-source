Migrations.add({
  version: 52,
  name: 'Drop old redundant collections',
  up: ()=> {
    let collectionsToDrop = ['actualSales',
      'forecastCafe',
      'forecastDates',
      'orderingUnits',
      'post',
      'salesCalibration',
      'salesForecast',
      'templateShifts',
      'usingUnits',
      'staleSessionConfigs'
    ];

    collectionsToDrop.forEach((collName)=> {
      Migrations.utils.removeCollection(collName);
    });
  }
});