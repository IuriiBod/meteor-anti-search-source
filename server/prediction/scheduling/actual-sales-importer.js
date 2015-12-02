/**
 * Imports actual sales from POS system, connected to specified location
 *
 * @param locationId
 * @constructor
 */
ActualSalesImporter = function ActualSalesImporter(locationId) {
  this._location = Locations.findOne({_id: locationId});
  this._revelClient = new Revel(this._location.pos);
};


ActualSalesImporter.prototype._updateActualSale = function (item) {
  DailySales.update({
    date: TimeRangeQueryBuilder.forDay(item.date, this._location),
    menuItemId: item.menuItemId,
    relations: item.relations
  }, {
    $inc: {
      actualQuantity: item.actualQuantity
    },
    $set: {
      date: item.date
    }
  }, {upsert: true});
};


ActualSalesImporter.prototype._getMenuItemByPosName = function (posMenuItemName) {
  return MenuItems.findOne({
    posNames: posMenuItemName,
    'relations.locationId': this._location._id
  }, {fields: {relations: 1, _id: 1}});
};


ActualSalesImporter.prototype._getLastImportedSaleMoment = function () {
  var lastImportedSale = DailySales.findOne({
    'relations.locationId': this._location._id,
    actualQuantity: {$gt: 0}
  }, {
    sort: {date: -1}
  });

  var lastMoment;
  if (lastImportedSale) {
    lastMoment = HospoHero.dateUtils.getDateMomentForLocation(lastImportedSale.date, this._location._id)
  } else {
    // if there is no imported data the import whole year
    lastMoment = moment().subtract(1, 'year');
  }

  return lastMoment.endOf('day');
};


ActualSalesImporter.prototype._createOnDailySaleUploadCallback = function (lastMomentToImport) {
  var self = this;

  return function (salesData) {

    //check if we need to stop
    if (lastMomentToImport.isAfter(salesData.createdMoment)) {
      return false;
    }

    var createdDate = salesData.createdMoment.toDate();

    _.each(salesData.menuItems, function (actualQuantity, posMenuItemName) {
      var menuItem = self._getMenuItemByPosName(posMenuItemName);

      if (menuItem) {
        var item = {
          actualQuantity: actualQuantity,
          date: createdDate,
          menuItemId: menuItem._id,
          relations: menuItem.relations
        };

        self._updateActualSale(item);
      } else {
        logger.warn('Mapped menu item not found', {posName: posMenuItemName});
      }
    });

    return true;
  };
};

/**
 * Removes all actual and forecast sales for specified location
 * @private
 */
ActualSalesImporter.prototype._resetActualSales = function () {
  var locationDocumentQuery = {
    'relations.locationId': this._location._id
  };

  DailySales.remove(locationDocumentQuery);

  MenuItems.update(locationDocumentQuery, {
    $unset: {
      isNotSyncedWithPos: '',
      lastForecastModelUpdateDate: ''
    }
  }, {multi: true});
};

/**
 * Imports all actual sales that are in pos
 *
 * @param {boolean} [resetAllBeforeImport] removes all data instead of adding to existing actual sales
 */
ActualSalesImporter.prototype.importAll = function (resetAllBeforeImport) {
  if (resetAllBeforeImport) {
    this._resetActualSales();
  }

  var lastMomentToImport = this._getLastImportedSaleMoment();

  //this function is used as callback in revel connector
  //it should return false if loading is finished
  var onDateUploaded = this._createOnDailySaleUploadCallback(lastMomentToImport);

  logger.info('Started actual sales import', {locationId: this._location._id});
  this._revelClient.uploadAndReduceOrderItems(onDateUploaded);

  logger.info('Import is finished');
};