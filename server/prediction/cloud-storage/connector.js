var CloudSettings = Meteor.settings.GoogleCloud;

CsvEntryGenerator = {
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
  /**
   *
   * @param onFirstDayReceived callback used to import last day sales
   */
  uploadTrainingData: function (onFirstDayReceived /*location*/) {
    //var through = Meteor.npmRequire('through');
    //var bucket = this._googleCloud.storage().bucket(CloudSettings.BUCKET);
    //var trainingDataWriteStream = new through();
    //
    //trainingDataWriteStream.pipe(bucket.file(GooglePredictionApi.getTrainingFileName()).createWriteStream());

    logger.info('Starting uploading from POS');

    var uploadedDaysCount = 0;
    var isHandledFirstDay = false;
    var self = this;

    //upload sales training data for the last year
    Revel.uploadAndReduceOrderItems(function (salesData) {
      if (!isHandledFirstDay) {
        onFirstDayReceived(salesData);
        isHandledFirstDay = false;
      }

      logger.info('Received daily sales', {date: salesData.createdDate});

      //todo replace location with "Location's" location
      var weather = OpenWeatherMap.history(new Date(salesData.createdDate), Meteor.settings.Location);

      var csvEntriesForCurrentDay = CsvEntryGenerator.generate(salesData, weather);

      console.log('pushed csv', csvEntriesForCurrentDay);

      //trainingDataWriteStream.push(csvEntriesForCurrentDay);

      uploadedDaysCount++;

      return false;//uploadedDaysCount < self.MAX_UPLOADED_DAYS_COUNT;
    });
  }
};