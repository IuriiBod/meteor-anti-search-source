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
    date: TimeRangeQueryBuilder.forDay(item.date, this._location._id),
    menuItemId: item.menuItemId,
    relations: item.relations
  }, {$inc: {actualQuantity: item.actualQuantity}, $set: {date: item.date}}, {upsert: true});
};


ActualSalesImporter.prototype._getLastImportedSaleDate = function (menuItemId) {
  var lastImportedSale = DailySales.findOne({
    'relations.locationId': this._location._id,
    menuItemId: menuItemId,
    actualQuantity: {$gt: 0}
  }, {
    sort: {date: -1}
  });

  // if there is no imported data the import whole year
  return lastImportedSale
    && HsopoHero.dateUtils.getDateMomentForLocation(lastImportedSale.date, this._location._id).endOf('day').toDate()
    || moment().subtract(1, 'year').toDate();
};

/**
 * Imports actual sales for single menu item
 *
 * @param menuItem
 */
ActualSalesImporter.prototype.importForMenuItem = function (menuItem) {
  var self = this;

  var lastDateToImport = this._getLastImportedSaleDate(menuItem._id);

  logger.info('Started actual sales import', {menuItemId: menuItem._id, name: menuItem.name});

  //this function is used like a callback in revel connector
  //it should return false if loading is finished
  var onDateUploaded = function (salesData) {
    var needContinueLoading = !moment(salesData.createdDate).isBefore(lastDateToImport);

    if (!needContinueLoading) {
      return false;
    }

    var item = {
      actualQuantity: salesData.quantity,
      date: salesData.createdDate,
      menuItemId: menuItem._id,
      relations: menuItem.relations
    };

    self._updateActualSale(item);

    return true;
  };


  //upload sales using pos connector
  menuItem.posNames.forEach(function (posName) {
    var posMenuItem = PosMenuItems.findOne({
      name: posName,
      'relations.locationId': self._location._id
    });

    logger.info('POS product', {_id: posMenuItem._id, name: posName});

    self._revelClient.uploadAndReduceOrderItems(onDateUploaded, posMenuItem.posId);
  });

  logger.info('Import is finished');
};

/**
 * Imports actual sales for specified menu items
 * @param menuItemsToImportQuery menu items' mongodb query
 */
ActualSalesImporter.prototype.importByQuery = function (menuItemsToImportQuery) {
  var menuItemsToSync = MenuItems.find(menuItemsToImportQuery, {fields: {_id: 1, posNames: 1, relations: 1, name: 1}});
  var self = this;

  menuItemsToSync.forEach(function (menuItem) {
    self.importForMenuItem(menuItem);
  });
};