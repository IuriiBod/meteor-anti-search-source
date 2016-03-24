Template.applicationProgressCheckbox.onCreated(function () {
  let checkboxes = _.pluck(this.data.checkboxes, 'name');

  let checkedItemIndex = checkboxes.indexOf(this.data.checked);
  let currentIndex = checkboxes.indexOf(this.data.checkbox.name);

  this.isChecked = currentIndex <= checkedItemIndex;
});

Template.applicationProgressCheckbox.helpers({
  checkboxAttr () {
    if (Template.instance().isChecked) {
      return {
        checked: true,
        disabled: true
      }
    }
  },

  checked () {
    return Template.instance().isChecked;
  }
});

Template.applicationProgressCheckbox.events({
  'change input': function (event, tmpl) {
    tmpl.data.onCheckboxChange(tmpl.data.checkbox, () => {
      event.target.checked = false;
    });
  }
});