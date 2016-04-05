Template.recruitmentFormFilePicker.helpers({
  files(){
    return this.files.list();
  }
});

Template.recruitmentFormFilePicker.events({
  'click .upload-files-button'(event, tmpl){
    filepicker.pickAndStore(
      {
        extensions: ['.jpg', '.jpeg', '.png', '.doc', '.docx', '.pdf', '.xls', '.csv'],
        services: ['COMPUTER'],
        multiple: true
      },
      {},
      (InkBlobs) => {
        if (Array.isArray(InkBlobs)) {
          _.each(InkBlobs, (item) => {
            tmpl.data.files.push(_.extend(item, {_id: new Mongo.ObjectID()._str}));
          });
        }
      });
  }
});
