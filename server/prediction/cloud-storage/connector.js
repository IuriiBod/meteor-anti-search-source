var CloudSettings = Meteor.settings.GoogleCloud;

var CsvEntryGenerator = {
  generate: function (salesData, weather) {
    var csvString = '';
    var dayOfYear = moment(salesData.createdDate).dayOfYear();

    _.each(salesData.menuItems, function (selledCount, menuItemName) {
      //todo update code for organization
      var menuItem = MenuItems.findOne({revelName: menuItemName});
      if (!menuItem) {
        //try find by name
        //todo update code for organization
        menuItem = MenuItems.findOne({name: menuItemName});
      }

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

  //todo update this code for one location
  //todo make unique files for different locations like: "sales-data-#{locationId}"
  createTrainingDataUploadingSession: function (onUploadingFinishedCallback) {
    var through = Meteor.npmRequire('through');
    var bucket = this._googleCloud.storage().bucket(CloudSettings.BUCKET);
    var trainingDataWriteStream = new through();

    trainingDataWriteStream.pipe(bucket.file(GooglePredictionApi.getTrainingFileName()).createWriteStream());

    logger.info('Starting uploading from POS');

    var uploadedDaysCount = 0;
    var self = this;

    return {
      onDataReceived: function (salesData) {
        logger.info('Received daily sales', {date: salesData.createdDate});

        //todo replace location with "Location's" location
        var weather = OpenWeatherMap.history(salesData.createdDate, Meteor.settings.Location);
        var csvEntriesForCurrentDay = CsvEntryGenerator.generate(salesData, weather);
        trainingDataWriteStream.push(csvEntriesForCurrentDay);

        uploadedDaysCount++;

        return uploadedDaysCount < self.MAX_UPLOADED_DAYS_COUNT;
      },
      onUploadingFinished: function () {
        trainingDataWriteStream.end();
        onUploadingFinishedCallback();
      }
    }
  }
};