Template.ghostEditable.events({
  'keyup .ghost-editable-input': function (event, tmpl) {
    if (event.keyCode === 13) {
      var newValue = tmpl.$('.ghost-editable-input').val();

      FlowComponents.callAction('submitValue', newValue);
    }
  }
});
