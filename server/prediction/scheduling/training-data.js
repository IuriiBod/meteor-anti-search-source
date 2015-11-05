var ActualSalesImporter = function ActualSalesImporter(locationId) {
  this._locationId = locationId;
};


ActualSalesImporter.prototype._getMenuItemByRevelName = function (menuItemName) {
  return MenuItems.findOne({
    'relations.locationId': this._locationId,
    $or: [{revelName: menuItemName}, {name: menuItemName}]
  });
};


ActualSalesImporter.prototype._updateActualSale = function (item) {
  DailySales.update({
    date: TimeRangeQueryBuilder.forDay(item.date),
    menuItemId: item.menuItemId
  }, {$set: item}, {upsert: true});
};


ActualSalesImporter.prototype._getLastImportedSaleDate = function () {
  var lastImportedSale = DailySales.findOne({
    'relations.locationId': this._locationId,
    actualQuantity: {$gt: 0}
  }, {
    sort: {date: -1}
  });

  // if there is no imported data the import whole year
  return lastImportedSale && lastImportedSale.date || moment().subtract(1, 'year').toDate();
};


ActualSalesImporter.prototype.getOnDayReceivedCallback = function () {
  var self = this;

  var lastDateToImport = this._getLastImportedSaleDate();

  //this function is used like a callback in revel connector
  //it should return false if loading is finished
  return function (salesData) {
    Object.keys(salesData.menuItems).forEach(function (menuItemName) {
      var menuItem = self._getMenuItemByRevelName(menuItemName);

      if (menuItem) {
        var item = {
          actualQuantity: salesData.menuItems[menuItemName],
          date: salesData.createdDate,
          menuItemId: menuItem._id,
          relations: menuItem.relations
        };
        self._updateActualSale(item);
      }
    });

    return !moment(salesData.createdDate).isBefore(lastDateToImport);
  };
};


predictionModelRefreshJob = function () {
  var locations = Locations.find({archived: {$ne: true}});

  locations.forEach(function (location) {
    var predictionEnabled = HospoHero.prediction.isAvailableForLocation(location);

    if (predictionEnabled) {
      logger.info('Started import actual sales data', {locationId: location._id});
      //import missed actual sales
      var revelClient = new Revel(location.pos);
      var salesImporter = new ActualSalesImporter(location._id);
      revelClient.uploadAndReduceOrderItems(salesImporter.getOnDayReceivedCallback());

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