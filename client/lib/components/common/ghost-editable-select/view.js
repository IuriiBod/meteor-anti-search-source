Template.ghostEditableSelect.events({
  'click .ghost-editable-select-trigger': function (event) {
    event.preventDefault();
    FlowComponents.callAction('setInlineMode', false);
  },

  'change .ghost-editable-select': function (event) {
    FlowComponents.callAction('onValueChanged', event.target.value);
  }
});