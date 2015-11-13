predictionModelRefreshJob = function () {
  var locations = Locations.find({archived: {$ne: true}});

  locations.forEach(function (location) {
    var predictionEnabled = HospoHero.prediction.isAvailableForLocation(location);

    if (predictionEnabled) {
      logger.info('Started import actual sales data', {locationId: location._id});

      var menuItemsQuery = HospoHero.prediction.getMenuItemsForPredictionQuery({'relations.locationId': location._id}, true);

      //import missed actual sales
      var salesImporter = new ActualSalesImporter(location._id);
      salesImporter.importByQuery(menuItemsQuery);

      //try to update prediction model
      var predictionApi = new GooglePredictionApi(location._id);
      predictionApi.updatePredictionModel();
    }
  });
};


//!!! disable it temporaly to be able control it manually
//if (!HospoHero.isDevelopmentMode()) {
//  SyncedCron.add({
//    name: 'Prediction model refresh',
//    schedule: function (parser) {
//      return parser.text('at 03:00 am');
//    },
//    job: predictionModelRefreshJob
//  });
//}