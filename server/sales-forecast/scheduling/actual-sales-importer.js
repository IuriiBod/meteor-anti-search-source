/**
 * Imports actual sales from POS system, connected to specified location
 *
 * @param locationId
 * @constructor
 */
ActualSalesImporter = class ActualSalesImporter {
  constructor(locationId) {
    this._location = Locations.findOne({_id: locationId});
    this._revelClient = new Revel(this._location.pos);
  }

  _updateActualSale(item) {
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
  }

  _getMenuItemByPosName(posMenuItemName) {
    return MenuItems.findOne({
      posNames: posMenuItemName,
      'relations.locationId': this._location._id
    }, {fields: {relations: 1, _id: 1}});
  }

  _getLastImportedSaleMoment() {
    if (Meteor.settings.prediction.revelCustomOffset) {
      return moment().subtract(1, 'year').endOf('day');
    }

    let lastImportedSale = DailySales.findOne({
      'relations.locationId': this._location._id,
      actualQuantity: {$gt: 0}
    }, {
      sort: {date: -1}
    });

    let lastMoment;
    if (lastImportedSale) {
      lastMoment = HospoHero.dateUtils.getDateMomentForLocation(lastImportedSale.date, this._location._id);
    } else {
      // if there is no imported data the import whole year
      lastMoment = moment().subtract(1, 'year');
    }

    return lastMoment.endOf('day');
  }

  /**
   * @param {Array} unmappedPosItemsNames
   * @private
   */
  _sendUnmappedPosItemsNotification(unmappedPosItemsNames) {
    if (unmappedPosItemsNames.length > 0) {
      let areasIds = Areas.find({locationId: this._location._id}).map(area => area._id);
      let receivers = Roles.getUsersByActionForArea('view forecast', areasIds).map(user => user._id);

      let notificationSender = new NotificationSender(
        `Sales occurring but not mapped in ${this._location.name}`,
        'unmapped-pos-items',
        {
          unmappedPosItemsNames,
          locationName: this._location.name
        },
        {
          shareable: true,
          helpers: {
            posMenuLinkingUrl: function () {
              return NotificationSender.urlFor('posSettings', {}, this);
            }
          }
        }
      );

      receivers.forEach(receiverId => {
        notificationSender.sendNotification(receiverId);
      });
    }
  }

  _createOnDailySaleUploadCallback(lastMomentToImport) {
    let self = this;
    let ignoredPosMenuItems = {};

    return {
      processSalesFn(salesData) {
        //check if we need to stop
        if (lastMomentToImport.isAfter(salesData.createdMoment)) {
          return false;
        }

        let createdDate = salesData.createdMoment.toDate();

        _.each(salesData.menuItems, function (actualQuantity, posMenuItemName) {
          let menuItem = self._getMenuItemByPosName(posMenuItemName);

          if (menuItem) {
            let item = {
              actualQuantity: actualQuantity,
              date: createdDate,
              menuItemId: menuItem._id,
              relations: menuItem.relations
            };

            self._updateActualSale(item);
          } else {
            ignoredPosMenuItems[posMenuItemName] = true;
          }
        });

        return true;
      },

      onUploadFinished(){
        let ignoredItemsNames = Object.keys(ignoredPosMenuItems);
        logger.info('Send notification about ignored order items', {count: ignoredItemsNames.length});
        self._sendUnmappedPosItemsNotification(ignoredItemsNames);
      }
    };
  }

  /**
   * Removes all actual and forecast sales for specified location
   * @private
   */
  _resetActualSales() {
    let locationDocumentQuery = {
      'relations.locationId': this._location._id
    };

    DailySales.remove(locationDocumentQuery);

    MenuItems.update(locationDocumentQuery, {
      $unset: {
        isNotSyncedWithPos: '',
        lastForecastModelUpdateDate: ''
      }
    }, {multi: true});
  }

  /**
   * Imports all actual sales that are in pos
   *
   * @param {boolean} [resetAllBeforeImport] removes all data instead of adding to existing actual sales
   */
  importAll(resetAllBeforeImport) {
    if (resetAllBeforeImport) {
      this._resetActualSales();
    }

    let lastMomentToImport = this._getLastImportedSaleMoment();

    //this function is used as callback in revel connector
    //it should return false if loading is finished
    let onDateUploaded = this._createOnDailySaleUploadCallback(lastMomentToImport);

    this._revelClient.uploadAndReduceOrderItems(onDateUploaded.processSalesFn);

    onDateUploaded.onUploadFinished();
    logger.info('Import is finished');
  }
};