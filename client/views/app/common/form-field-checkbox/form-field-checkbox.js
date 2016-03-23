Template.formFieldCheckbox.events({
  'change input': function (event, tmpl) {
    let isChecked = event.target.checked;
    tmpl.data.onCheckboxChange(tmpl.data.checkboxSettings.fieldName, isChecked);
  }
});