updateTrainingDataForLocation = function (location, forceUpdate) {
  var predictionEnabled = HospoHero.prediction.isAvailableForLocation(location);

  if (predictionEnabled) {
    logger.info('Started import actual sales data', {locationId: location._id, name: location.name});

    var menuItemsQuery = HospoHero.prediction.getMenuItemsForPredictionQuery({'relations.locationId': location._id}, true);

    //import missed actual sales
    var salesImporter = new ActualSalesImporter(location._id);
    salesImporter.importAll();

    //try to update prediction model
    var predictionApi = new GooglePredictionApi(location._id);
    predictionApi.updatePredictionModel(menuItemsQuery, forceUpdate);
  }
};


// if (!HospoHero.isDevelopmentMode()) {
//   HospoHero.LocationScheduler.addDailyJob('Training data uploading', function () {
//     return 1; //at 1:00 AM
//   }, function (location) {
//     logger.info('Started updating of prediction model', {locationId: location._id});
//     updateTrainingDataForLocation(location, false);
//   });
// }