Template.applicationProgressCheckbox.helpers({
  checkboxAttr () {
    if (this.checkbox.isChecked) {
      return {
        checked: true,
        disabled: true
      }
    }
  }
});

Template.applicationProgressCheckbox.events({
  'change input': function (event, tmpl) {
    tmpl.data.onCheckboxChange(tmpl.data.checkbox.fieldName, () => {
      event.target.checked = false;
    });
  }
});