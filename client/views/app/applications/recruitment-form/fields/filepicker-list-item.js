Template.filepickerListItem.events({
  'click .remove-file'(event, tmpl) {
    let id = tmpl.data._id;
    // Save item to remove
    let files = Template.parentData(1).files;
    let blob = files.find(item => item._id === id);
    // Remove from Ui
    files.remove(item => item._id === id);
    // Remove from server
    filepicker.remove(blob, () => {
    }, (FPError) => {
      // If error return item into ui
      files.push(blob);
      HospoHero.error(FPError);
    });
  }
});
