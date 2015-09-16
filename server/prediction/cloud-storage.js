var CloudSettings = Meteor.settings.private.GoogleCloud;
GoogleCloud = new gcloud({
  projectId: CloudSettings.PROJECT_ID,
  credentials: {
    client_email: CloudSettings.SERVICE_EMAIL,
    private_key: Assets.getText(CloudSettings.PEM_FILE)
  }
});


uploadFileTest = function () {
  var bucket = GoogleCloud.storage().bucket('hospohero');
  bucket.upload(process.env.PWD + '/smart.json', function (err, f) {
    console.log(err, f);
  });
};
