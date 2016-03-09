Template.filesWidget.onCreated(function () {
  this.subscribe('files', this.data.referenceId);
});


Template.filesWidget.helpers({
  files () {
    return Files.find({
      referenceId: this.referenceId
    });
  },

  filesOptions() {
    return {
      namespace: this.type,
      uiStateId: 'files',
      title: 'Files',
      buttons: [{
        url: '#',
        className: 'btn btn-primary btn-xs pull-left attach-file',
        text: 'Attach File'
      }]
    };
  }
});


Template.filesWidget.events({
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