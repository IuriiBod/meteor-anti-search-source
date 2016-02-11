Template.files.onCreated(function () {
  this.subscribe('files', this.data.referenceId);
});


Template.files.helpers({
  files () {
    return Files.find({
      referenceId: this.referenceId
    });
  }
});


Template.files.events({
  'click .attach-file' (event, tmpl) {
    filepicker.pickAndStore(
      {
        extensions: ['.jpg', '.jpeg', '.png', '.doc', '.docx', '.pdf', '.xls', '.csv'],
        services: ['COMPUTER'],
        multiple: true
      },
      {},
      function (InkBlobs) {
        var files = (InkBlobs);
        if (files && files.length) {
          files.forEach((file) => {
            let fileDocument = {
              name: file.filename,
              url: file.url,
              referenceId: tmpl.data.referenceId
            };

            Meteor.call('addFile', fileDocument, HospoHero.handleMethodResult());
          });
        }
      });
  }
});