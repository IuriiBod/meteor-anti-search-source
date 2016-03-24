Template.applicationProgressCheckboxes.helpers({
  onCheckboxChange () {
    let applicationEditData = Template.parentData(1);
    let checkboxes = applicationEditData.checkboxes.map(checkboxSettings => checkboxSettings.fieldTitle);
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