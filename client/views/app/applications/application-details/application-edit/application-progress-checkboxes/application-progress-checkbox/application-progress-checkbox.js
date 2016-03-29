Template.applicationProgressCheckbox.helpers({
  checked () {
    return this.checked.indexOf(this.checkbox) > -1;
  },

  checkboxAttr () {
    if (this.checked.indexOf(this.checkbox) > -1) {
      return {
        checked: true,
        disabled: true
      };
    }
  }
});

Template.applicationProgressCheckbox.events({
  'click input': function (event, tmpl) {
    let onChange = tmpl.data.onCheckboxChange;

    if (_.isFunction(onChange)) {
      onChange(tmpl.data.checkbox);
    }
  }
});