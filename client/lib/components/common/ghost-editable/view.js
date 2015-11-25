Template.ghostEditable.onCreated(function () {
  this.showSubmitButton = new ReactiveVar(false);

  this.getInputValue = function () {
    return this.$('.ghost-editable-input').val();
  };

  this.submitValue = function () {
    var newValue = this.getInputValue();
    FlowComponents.callAction('submitValue', newValue);
  };
});


Template.ghostEditable.helpers({
  showSubmitButton: function () {
    return Template.instance().showSubmitButton.get();
  }
});


Template.ghostEditable.events({
  'keyup .ghost-editable-input': function (event, tmpl) {
    tmpl.showSubmitButton.set(true);
    if (event.keyCode === 13) {
      tmpl.submitValue();
    }
  },

  'click .submit-value-button': function (event, tmpl) {
    tmpl.submitValue();
  }
});
