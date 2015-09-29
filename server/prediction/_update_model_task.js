job = function () {
//updates sales data for previous day
  var isHandledFirstDay = false;
  var previousDayMoment = moment().subtract(1, 'day');

  var updateActualSalesData = function (salesData) {
    if (!isHandledFirstDay && previousDayMoment.isSame(salesData.createdDate, 'day')) {
      //todo save sales data here
      console.log('data to update ', salesData);
      isHandledFirstDay = false;
      return false;
    }
    return true;
  };

  //if we need update model then
  if (!HospoHero.isDevelopmentMode()) {
    //todo: update it for organizations
    var predictionApi = new GooglePredictionApi();
    var updateSession = predictionApi.getUpdatePredictionModelSession();

    //upload sales training data for the last year
    Revel.uploadAndReduceOrderItems(function (salesData) {
      updateActualSalesData(salesData);
      return updateSession.onDataReceived(salesData);
    });

    updateSession.onUploadingFinished();

  }
  //else
  //upload sales for last day
  Revel.uploadAndReduceOrderItems(function (salesData) {
    return updateActualSalesData(salesData);
  });


};