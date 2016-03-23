Template.ghostEditable.onCreated(function () {
  this.isEditableInput = new ReactiveVar(false);

  this.getInputValue = function () {
    return this.$('.ghost-editable-input').val();
  };

  this.submitValue = function () {
    var newValue = this.getInputValue();
    if (newValue.toString() !== this.data.value.toString()) {
      if (_.isFunction(this.data.onValueChanged)) {
        this.data.onValueChanged(newValue);
      }
      this.isEditableInput.set(false);
    }
  };
});


Template.ghostEditable.helpers({
  isEditable() {
    return Template.instance().isEditableInput.get();
  }
});


Template.ghostEditable.events({
  'click .ge-save-value': function (event, tmpl) {
    event.preventDefault();
    tmpl.submitValue();
  },

  'click .ge-cancel-saving-value': function (event, tmpl) {
    tmpl.isEditableInput.set(false);
  },

  'click .ghost-editable-value': function (event, tmpl) {
    event.preventDefault();
    tmpl.isEditableInput.set(true);
  }
});