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

var component = FlowComponents.define('ghostEditable', function (props) {
  this.set('value', props.value);

  if (props.onValueChanged) {
    this.onValueChanged = props.onValueChanged;
  }
});

component.action.submitValue = function (newValue) {
  if (newValue.toString() !== this.get('value').toString()) {
    this.set('value', newValue);

    if (_.isFunction(this.onValueChanged)) {
      this.onValueChanged(newValue);
    }
  }
};