var CloudSettings = Meteor.settings.private.GoogleCloud;
GoogleCloud = new gcloud({
  projectId: CloudSettings.PROJECT_ID,
  credentials: {
    client_email: CloudSettings.SERVICE_EMAIL,
    private_key: Assets.getText(CloudSettings.PEM_FILE)
  }
});


uploadFileTest = function (data1) {
  var through = Meteor.npmRequire('through');
  var bucket = GoogleCloud.storage().bucket(CloudSettings.BUCKET);
  str = new through();

  // str.pipe(bucket.file('test.csv').createWriteStream());
  // str.push(data1);
  // str.end();
};
