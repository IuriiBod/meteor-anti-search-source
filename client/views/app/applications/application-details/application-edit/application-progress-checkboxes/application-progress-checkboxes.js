Template.applicationProgressCheckboxes.helpers({
  onCheckboxChange () {
    let applicationEditData = Template.parentData(1);

    console.log('APP', applicationEditData);
    
    let checkboxes = applicationEditData.checkboxes.map(checkbox => checkbox.name);

    let checkedItemIndex = checkboxes.indexOf(applicationEditData.checked);

    return (status, onErrorCallback) => {
      // check that checked checkbox is exactly after last checked element
      let newCheckedItemIndex = checkboxes.indexOf(status);

      if (newCheckedItemIndex - checkedItemIndex === 1) {
        let applicationId = HospoHero.getParamsFromRoute('id');
        Meteor.call('updateApplicationStatus', applicationId, status, HospoHero.handleMethodResult());
      } else {
        onErrorCallback();
      }
    };
  }
});