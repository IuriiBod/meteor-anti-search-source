var CloudSettings = Meteor.settings.private.GoogleCloud;

CsvEntryGenerator = {
  generate: function (salesData, weather) {
    var csvString = '';
    var dayOfYear = moment(salesData.createdDate).dayOfYear();

    _.each(salesData.menuItems, function (selledCount, menuItemName) {
      //todo replace menu item name with it's ID
      //todo update code for organization
      csvString += selledCount + ', "' + menuItemName + '", ' + weather.temp + ', "' + weather.main + '", ' + dayOfYear + '\n';
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

  //todo update this code for multiple locations: open multiple streams
  //todo make unique files for differnt locations like: "sales-data-#{locationId}"
  uploadTrainingData: function (/*location*/) {
    var through = Meteor.npmRequire('through');
    var bucket = this._googleCloud.storage().bucket(CloudSettings.BUCKET);
    var trainingDataWriteStream = new through();

    trainingDataWriteStream.pipe(bucket.file('sales-data.csv').createWriteStream());

    logger.info('Starting uploading from POS');

    //upload sales training data for the last year
    Revel.uploadAndReduceOrderItems(function (salesData) {
      logger.info('Received daly sales', {date: salesData.createdDate});

      //todo replace location with "Location's" location
      //todo replace historyMock with history method
      var weather = OpenWeatherMap.historyMock(new Date(salesData.createdDate), Meteor.settings.private.LOCATION);

      var csvEntriesForCurrentDay = CsvEntryGenerator.generate(salesData, weather);

      trainingDataWriteStream.push(csvEntriesForCurrentDay);

    }, function (uploadedDaysCount) {
      logger.info('Sales data uploading finished', {uploadedDaysCount: uploadedDaysCount});
      trainingDataWriteStream.end();
    }, 20);

  }
};