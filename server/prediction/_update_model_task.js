job = function () {
//updates sales data for previous day
  var updateActualSalesData = function (salesDataForPreviousDay) {
    console.log('data to update ', salesDataForPreviousDay);
  };

  if (!HospoHero.isDevelopmentMode()) {
    //todo: update it for organizations
    var predictionApi = new GooglePredictionApi();
    predictionApi.updatePredictionModel(updateActualSalesData);
  }
};