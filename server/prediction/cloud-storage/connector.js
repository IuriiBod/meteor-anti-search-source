var CloudSettings = Meteor.settings.GoogleCloud;

var CsvEntryGenerator = {
  generate: function (salesData, weather, locationId) {
    var csvString = '';
    var dayOfYear = moment(salesData.createdDate).dayOfYear();

    _.each(salesData.menuItems, function (selledCount, menuItemName) {
      var menuItem = HospoHero.prediction.getMenuItemByRevelName(menuItemName, locationId);

      if (menuItem) {
        csvString += selledCount + ', "' + menuItem._id + '", ' + weather.temp + ', "' + weather.main + '", ' + dayOfYear + '\n';
      } else {
        //otherwise ignore this data (we don't know which menu is it)
        logger.info('Appropriate menu item not found', {name: menuItemName});
      }
    });

    return csvString;
  }
};

GoogleCloud = {
  _googleCloud: new gcloud({
    projectId: CloudSettings.PROJECT_ID,
    credentials: {
      client_email: CloudSettings.SERVICE_EMAIL,
      private_key: Assets.getText(CloudSettings.PEM_FILE)
    }
  }),

  MAX_UPLOADED_DAYS_COUNT: 365,

  createTrainingDataUploadingSession: function (trainingFileName, locationId, onUploadingFinishedCallback) {
    var bucket = this._googleCloud.storage().bucket(CloudSettings.BUCKET);
    var trainingDataWriteStream = new through();

    trainingDataWriteStream.pipe(bucket.file(trainingFileName).createWriteStream());

    logger.info('Starting uploading from POS');

    var uploadedDaysCount = 0;
    var self = this;

    return {
      onDataReceived: function (salesData) {
        logger.info('Received daily sales', {date: salesData.createdDate});
        var location = Locations.findOne({_id: locationId});
        var worldWeather = new WorldWeather(location.country, location.city);
        var weather = worldWeather.getHistorical(salesData.createdDate)[0];
        var csvEntriesForCurrentDay = CsvEntryGenerator.generate(salesData, weather, locationId);
        trainingDataWriteStream.push(csvEntriesForCurrentDay);

        uploadedDaysCount++;

        return uploadedDaysCount < self.MAX_UPLOADED_DAYS_COUNT;
      },
      onUploadingFinished: function () {
        trainingDataWriteStream.end();
        onUploadingFinishedCallback();
      }
    }
  },

  removeTrainingDataFile: function (trainingFileName) {
    var bucket = this._googleCloud.storage().bucket(CloudSettings.BUCKET);
    var file = bucket.file(trainingFileName);
    file.delete(function (err, apiResponse) {
      if (err) {
        logger.error('error while removing training file', {error: err});
      }
    });
  }
};