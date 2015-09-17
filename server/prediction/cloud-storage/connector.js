var CloudSettings = Meteor.settings.private.GoogleCloud;

var GoogleCloud = new gcloud({
  projectId: CloudSettings.PROJECT_ID,
  credentials: {
    client_email: CloudSettings.SERVICE_EMAIL,
    private_key: Assets.getText(CloudSettings.PEM_FILE)
  }
});


GoogleCloudStorage = {
//todo add location in future
  uploadTrainingData: function (/*location*/) {
    var through = Meteor.npmRequire('through');
    var bucket = GoogleCloud.storage().bucket(CloudSettings.BUCKET);
    var trainingDataWriteStream = new through();

    //todo make unique files for differnt locations like: "sales-data-#{locationId}"
    trainingDataWriteStream.pipe(bucket.file('sales-data.csv').createWriteStream());

    trainingDataWriteStream.push(data);

    trainingDataWriteStream.end();
  }
};

