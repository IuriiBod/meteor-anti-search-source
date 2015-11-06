Template.singleColorPicker.events({
  'click .color-pick': function() {
    FlowComponents.callAction('setColorChecked');
  }
});